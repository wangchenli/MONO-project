
let baseUrl = 'http://localhost:3200/api'
let urls1 = {
    listData: '/users',
    books:"/books",
    hometitle:"/hometitle",
    find:"/find",
    comunity:'/comunity'
}
for(var attr in urls1){
    urls1[attr] = baseUrl + urls1[attr]
}
let urls2 = {
    movie:"https://api.douban.com/v2/movie/in_theaters",
}


export default {
    urls1,
    urls2
};
