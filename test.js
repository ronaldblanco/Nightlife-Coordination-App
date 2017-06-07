
function addSeconds(seconds){
    var date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}

console.log(addSeconds(15204733));