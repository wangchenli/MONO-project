
let baseUrl = 'http://localhost:3200/api'
let urls1 = {
    listData: '/users',
    books:"/books",
    movie:"/movie",
    hometitle:"/hometitle",
    find:"/find",
    comunity:'/comunity'
}
for(var attr in urls1){
    urls1[attr] = baseUrl + urls1[attr]
}


export default {
    urls1
};
