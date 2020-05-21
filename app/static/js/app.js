/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <div>
        <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet"> 
        <link rel="stylesheet" type="text/css" href="static/css/next.css">
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
                <a class="navbar-brand" href="#"><i class="fas fa-camera-retro"></i> Photogram</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item active">
                        <router-link to="/" class="nav-link"><strong>Home</strong> <span class="sr-only">(current)</span></router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link to="explore" class="nav-link"><strong>Explore</strong></router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link to="" class="nav-link" ><strong>My Profile</strong></router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link to="api/auth/logout" class="nav-link" ><strong>logout</strong></router-link>
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
            <h3 class="card-title text-center mt-3 mb-0"><i class="fas fa-camera-retro" size="7"></i> Photogram</h3>
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

const Register= Vue.component('register', {
    template:
    `      
    <div class= 'container centered'>
        <h1 class='page-header'>Register</h1>
        <ul class="">
            <li v-for="err in error" class="list alert alert-danger" role="alert">
                {{ err }}
            </li>
        </ul>
        
        <div>
            <form id="register-form" @submit.prevent='register' enctype='multipart/form-data' novalidate>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" name="username">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" name="password">
                </div>
                <div class="form-group">
                    <label for="firstname">Firstname</label>
                    <input type="text" class="form-control" id="firstname" name="firstname">
                </div>
                <div class="form-group">
                    <label for="lastname">Lastname</label>
                    <input type="text" class="form-control" id="lastname" name="lastname">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" name="email">
                </div>
                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" class="form-control" id="location" name="location">
                </div>
                <div class="form-group">
                    <label for="biography">Biography</label>
                    <textarea id="biography" class="form-control" name="biography"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="photo">Photo</label>
                    <input type="file" id="photo" class="form-control" name="profile_photo">
                </div>
            
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
        </div>
    </div>
    `,
    methods: {
        register: function() {
            
            let registerForm = document.getElementById('register-form');
            let formData = new FormData(registerForm);
            let self = this;
            
            fetch('/api/users/register', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(resp => resp.json())
            .then(function(jsonResp) {
                self.message = jsonResp.message;
                self.error = jsonResp.error;
                
                if (self.message) {
                    router.push({path: '/login', params: {response: self.message}})
                } else {
                    console.log(self.error);
                }
            })
            .catch(function(error) {
                console.log(error)
            })
        }
    },
    data: function() {
        return {
            error: [],
            message: ''
        }
    },
   
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

const postCard = Vue.component('postCard' ,{
    template: `
    <div class="card">
        <h4 class="card-title">yoyoyo</h4>
        <img src="https://www.planetware.com/photos-large/JAM/jamaica-seven-mile-beach.jpg" alt="Card image cap">
        <div class="card-body">
            <p>lorem</p>
            <div class="row pb-0">
                <p class="card-text text-left col"><i class="fas fa-heart"></i></p>
                <p class="text-right col">asdasd</p>
            </div> 
        </div>
    </div>
    `,
    props:['user','post']
});

const Explore = Vue.component('explore', {
    template: `
        <div class="row">
          <div class="col-9">
             <div v-for="post in posts" key="post.id">
                <postcard :post="post"></postcard>
             </div>
          </div>
          <div class="col-3">
          <router-link to="post/new" class="btn btn-primary px-5" >Add Post</router-link>
          </div>
        </div>
    `,
    created: function() {
        let self = this;
        fetch('/api/posts')
        .then(function(response) {return response.json();})
        .then(data => console.log(data))
        // .then(function(data) {self.articles = data.articles});
        } ,
    
    component: {
        'postcard' : postCard
    },
    data: function() {
       return {
           posts: [],
           error: []
       };
    },
    methods: {
        Addpost: function (){}
        
}
});

const Newpost= Vue.component('newpost', {
    template: `
        <div>
          <div id ="tall1"><p class="text-center">New Post </p></div>
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
            <div class="card container" style="width: 18rem">
           
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


const UserProfile = Vue.component('userprofile', {
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

const Logout= Vue.component('logout', {
    template: `<div></div>`,
    created: function() {
        
    },
    methods: {
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", name: "home", component: Home, props: true},
        {path: "/register", name: "register", component: Register},
        {path: "/login", name: "login", component: Login, props: true},
        {path: "/logout", name: "logout", component: Logout},
        {path: "/explore", name: "explore", path: "/explore", component: Explore, props: true},
        {path: "/posts/new", name: "newpost", component: NewPost},
        {path: "/users/:user_id", name: "userprofile", component: UserProfile},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
    

    
});
