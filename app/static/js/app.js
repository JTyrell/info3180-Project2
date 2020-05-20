/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <div>
        <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet"> 
        <link rel="stylesheet" type="text/css" href="static/css/next.css">
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
                <a class="navbar-brand" href="#">Photogram</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item active">
                        <a class="nav-link " href="/"><strong>Home</strong> <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="/explore"><strong>Explore</strong></a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="#"><strong>My Profile</strong></a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="#"><strong>logout</strong></a>
                    </li>
                </ul>
            </div>
            </nav>
    </div>
    `,
    watch: {
        '$route' (to, fom){
            this.reload()
        }
      },
    created: function() {
        let self = this;
        self.user=localStorage.getItem('token');
        self.userid=localStorage.getItem('userid')
    },
    data: function() {
        return {
            user: [],
        }
    },
    methods:{
        reload(){
            let self = this;
            self.user=localStorage.getItem('token');
            self.userid=localStorage.getItem('userid')
        }
    }
});


Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template:
   `
    <div class= "card-group mt-4"> 
        <div class="card mr-3">
        <img class="card-img-top" src="https://www.planetware.com/photos-large/JAM/jamaica-seven-mile-beach.jpg" alt="Card image cap">
        </div> 
        <div class="card">
            <h3 class="card-title text-center mt-3 mb-0">Photogram</h3>
            <hr class="ml-5 mr-5">
            <p class="card-body"> {{message}} </p>
            <div class="row">
                <router-link to="register"  class=" btn btn-success col ml-3 mr-2">Register</router-link>
                <router-link to="login"  class="btn btn-primary col mr-3 ml-2">Login</router-link>
            </div>  
        </div>
        
    </div>
   `,
    data: function() {
       return {
           message:"Share photos of your favourite moment with friends,family and the world"
       }
    }
});

const Register= Vue.component('register', {template:
`  
        
    <div class= "paper">
        <link rel="stylesheet" type="text/css" href="static/css/next.css">
        <ul class="list">
            <li v-for="resp in error" class="list alert alert-danger">
                {{ resp.errors[0] }} <br>
                {{ resp.errors[1] }}
                {{ resp.errors[2] }} <br>
                {{ resp.errors[3] }}
                {{ resp.errors[4] }} <br>
                {{ resp.errors[5] }}
                {{ resp.errors[6] }} <br>
                {{ resp.errors[7] }}
                {{ resp.errors[8] }} <br>
              
            </li>
        </ul>

        <h1 class="text-center"> Register </h1>
        
        <form id= "CreateUser"  @submit.prevent="Regist"   method="POST" enctype="multipart/form-data">
        <div class="card container" style="width: 18rem;">
            <div class="form-group mt-3">
              <label for="fName">First Name:</label>
              <input type="text" class="form-group form-control" name="firstname">
            </div>
            <div class="form-group">
              <label for="lName"word>Last Name:</label>
              <input type="text" class="form-group form-control" name="lastname" >
            </div>
            <div class="form-group">
              <label for="userName">Username:</label>
              <input type="text" class="form-group form-control" name="username">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="text" class="form-group form-control" name="email">
            </div>
            <div class="form-group">
              <label for="bio">Biography:</label>
              <input type="textarea" class="form-group form-control" name="biography">
            </div>
            <div class="form-group">
              <label for="location">Location:</label>
              <input type="text" class="form-group form-control" name="location">
            </div>
            <div class="form-group">
                <label for="msg"> Browse to Upload Photo </label>
            </div>
            <div class="upload-btn-wrapper">
                <button id="btn">Browse</button>
                <input type="file" name="profile_photo"/>
            </div>
          
            
            <br>
            
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" class="form-group form-control" name="password">
            </div>
            <div class="form-group">
              <label for="confirm">Confirm Password:</label>
              <input type="password" class="form-group form-control" name ="confirm">
            </div>
            <button class=" btn upload-btn bg-success" type="submit">Submit</button>
        </div>
        </form>
        
        
    </div>
    `
 ,
    data : function(){
        return {
            response:[],
            error:[],
            user: {

            }
        };
    },
    methods : {
        Regist : function(){
            let self = this;
            let newUser = document.getElementById('CreateUser');
            let form_data = new FormData(newUser);
            fetch("/api/users/register",{
                method: 'post',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            }).then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                })
                .catch(function (error) {
                console.log(error);
                });
            }
                
    }
});


const Login = Vue.component('login', {
   template: `
   <div class= "paper2" >
   <link rel="stylesheet" type="text/css" href="static/css/next.css">
        <ul class="list">
            <li v-for="resp in errors" class="list alert alert-danger">
                {{ resp }} <br>
                
            </li>
        </ul>

   
       <form id = "LoginForm" class="form-login" @submit.prevent="Log" method="post">
            <h2 class="text-center">Login</h2>
            <div class="card container" style="width: 18rem;">
                <div class="form-group mt-3">
                    <label for="username" class="sr-only">Username</label>
                    <input type="text" id="username" name="username" class="form-group form-control" placeholder="Your username" required >
                </div>
                <div class="form-group">
                    <label for="password" class="sr-only">Password</label>
                    <input type="password" id="password" name="password" class="form-group form-control" placeholder="Password" required>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </div>
            
        </form>
    </div>
   `,
      data : function(){
        return {
            errors:[],
            response:[]
        }
    },
    methods : {
        Log : function(){
        let user = document.getElementById('LoginForm');
        let form_data = new FormData(user);
        fetch("/api/auth/login",{
            method: 'post',
            body: form_data,
            headers: {
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        }).then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            })
            .catch(function (error) {
            console.log(error);
            });      
    }
}
 
});

const Explore = Vue.component('explore', {
    template:`
    <div>sdasd
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div v-if="messageFlag" class="sidenav">
            <router-link class="btn btn-primary but" to="/post/new">New Post</router-link>
        </div>
       
        <div class=" container-fluid fix-explore" v-if="output">
            <li v-for="resp in output "class="list" style = "list-style:none;" >
                <div id="wrap">
					<section class="main items">
    					<div class="boxout">
                            <p><img v-bind:src= "'/static/uploads/'+resp.proPhoto"style="width: 2rem; height: 2rem; padding: 3px; border-radius:100px;"/><router-link v-bind:to="'/users/' +resp.user_id">{{resp.username}}</router-link></p>
    						<article class="sub">
    							<header>
    								<img v-bind:src= "'/static/uploads/'+resp.photo" style="width: 32.9rem; height: 20rem;"/>
    							</header>
    							<p class="cap"><strong style="color:black;">{{resp.username}}:</strong> {{resp.caption}}</p>
    						</article>
    						<section class="like liker">
    						    <div v-if="resp.heart">
        						    <a  v-on:click="likes(resp.postid)" v-bind:value= "resp.postid"> <i  class="fa fa-heart" style="font-size:24px;color:red"></i></a>
                                    <a >{{resp.likes}} Likes</a>
                                    <a class="likey dark nohover" href="#"><span class="codeine core">{{resp.created_on}}</span></a>
                                </div>
                                <div v-else>
                                    <a  v-on:click="likes(resp.postid)"> <i class="fa fa-heart" style="font-size:24px;color:red"></i></a>
                                    <a >{{resp.likes}} Likes</a>
                                    <a class="likey dark nohover" href="#"><span class="codeine core">{{resp.created_on}}</span></a>
                                
                                </div>
                            </section>
    					</div>
					</section>
			     </div>
            </li>
        </div>
        <div v-else>
            <li v-for="resp in output"class="list">
                <h5>No Posts</h5>
            </li>
        </div> 
    </div>
`,
    created: function() {
        
        }, 
    data: function() {
        
    },

    methods: {
        
    likes: function(postid){
        }
  
    }
        
});

const uploadpost= Vue.component('upload-form', {
    template: `
        <div>
          <div id ="tall1"><p>New Post </p></div>
          <div>
            <ul class="list">
                <li v-for="resp in response" class="list alert alert-success">
                    {{ resp.message }}
                </li>
                <li v-for="resp in error" class="list alert alert-danger">
                    {{ resp.errors[0] }} <br>
                    {{ resp.errors[1] }}
                </li>
            </ul>

            <form id="uploadForm"  @submit.prevent="uploadPhoto" method="POST" enctype="multipart/form-data">
                <div id ="tall">
                    
                    <div class="form-group " id="tall1">
                        <label for="msg"> Photo </label>
                        <br>
                        <div class="upload-btn-wrapper">
                            <button id="btn">Browse</button>
                            <input type="file" name="photo" />
                        </div>
                    </div>
                   
                    <div class="form-group " id="tall1">
                        <label for="msg">Caption</label>
                        <br>
                        <textarea class="textbx" id="msg" placeholder="Write a Caption" name="caption"></textarea>
                    </div>
                <button class=" btn upload-btn btn-success btn-block" type="submit">Submit</button> 
                </div>
                <br/>
                
            </form>
          </div>
          </br>
        </div>
    `,
    data: function() {
       return {
           response: [],
           error: []
       };
    },
    methods: {
        
}
});


const UserProfile = Vue.component('use', {
    template: `
    <div>
        <link rel="stylesheet" type="text/css" href="static/css/next.css">
        <div v-if="info" class="container-fluid" style="background-color:white; width:100p%; height:200px; border-radius:5px; ">
            <li v-for="user in info" class="list" style="list-style:none;"id="vis">
                <div class="row border-style center profile profiles-container">
                    <a href="#"><img v-bind:src= "'/static/uploads/'+user.photo" class="post_pic"></a>
                        <div class="col">
                            <h2><strong>{{user.firstname}} {{user.lastname}}</strong></h2>
                            <h5 id="pro_info"><span>{{ user.location}}</span></h5>
                            <h5 id="pro_date"><span> Member since: {{ user.joined_on}}</span></h5>
                            <h5 id="pro_info"><span>{{ user.biography}}</span></h5>
                            
                        </div>
                    <div class="seeprofile center col-3 bio">
                        </br>
                        <section class="lki lkie wip"  >
                            <p class="count"><span class="post_len" >{{postr}}</span><span class="follen">{{numberoffollower}}</span></p>
                        </section>
                        <section class="lki lkie">
                            <p class="count"><span class="followtitle">Posts</span><span class="followtitle">Followers</span></p>
                        </section>
                        
                    </div>
                    <br>
                    <div v-if="auser">
                    </div>
                        <div v-else class="pro-btn">
                            <div v-if="following">
                                <a class="view-btn btn-warning btn-long pro-style" >Following</a>
                            <br>
                            <br>
                            </div>
                            <div  v-else>
                                <a class="view-btn btn-primary btn-long pro-style" @click="follow">Follow</a>
                            </div>
                        </div>
                </div >
                       
            </li>
        </div>
        <br>
        <div v-else >
            <li v-for="resp in info"class="list" style="list-style:none;">
                <h5>No Posts</h5>
            </li>
        </div>
        
        <div style="flex-direction: row">
            <div class="imageView">
                <li v-for=" i in output" style="list-style:none">
                    <img  v-bind:src= "'/static/uploads/'+i.photo" class="profile_post">
                </li>
            </div>
        </div>
    </div>
    `,
     created: function() {
        
    },
     data: function() {
       return {
           output:[],
           info:[],
           postr:[],
           Post:null,
           error: [],
           numberoffollower:[],
           following: null,
       }
     }
    ,
   methods : {
         follow: function(){

                }
   }
});

const logout= Vue.component('logout-form', {
    template: `<div></div>`,
    created: function() {
        
    },
    methods: {
    }
});

// Define Routes
const router = new VueRouter({
    routes: [
        {path: "/", component: Home },
        {path: "/register", component:Register},
        {path: "/login", component:Login},
        {path:"/explore", component:Explore}, //this suppose to work with, getpost, handlepost and like/likes, was thinking of making this all in one
        {path:"/post/new", component: uploadpost},
        {path:"/users/:userid",component: UserProfile},
        {path:"/logout",component: logout}
  ]
});
// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
    

    
});
