var app = new Vue({
    el:' #app',
    router: router,
    template: /*html*/`
<div id="app">
    <h1 class="flat">LC Rotation Manager</h1>
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/month">Month</router-link>
    </nav>
    <router-view></router-view>
</div>
`});