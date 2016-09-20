
    
function masonry() {
    var gridContainer = document.querySelector('.grid');
    var msnry = new Masonry('.grid', {
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer',
                percentPosition: true
            });
    
    console.log('masonry');
    imagesLoaded(gridContainer).on( 'progress', function() {
        // layout Masonry after each image loads
        msnry.layout();
    });
}
/////
function printList(auth, pics, status) {
    var gridContainer = document.querySelector('.grid');
    
    gridContainer.innerHTML = '<div class="grid-sizer"></div>';
    
    
    if (auth) {
        pics.forEach(function(image, i) {
            var deleteDiv = '', 
                likeDiv = '';
            
            if (status[i].isMyOwn) 
                deleteDiv = '<div class="delete info-left"><span onclick="deletePic(this.parentNode)"><i class="fa fa-times"></i></span></div>';
            if (status[i].liked) {
                likeDiv = '<div class="like info-right liked"><span  onclick="unlike(this.parentNode)"><i class="fa fa-heart"></i>  ' 
                    + image.likers.length + '</span></div>';
            } else {
                likeDiv = '<div class="like info-right"><span onclick="like(this.parentNode)"><i class="fa fa-heart"></i>  ' 
                + image.likers.length + '</span></div>';
            }
            
            gridContainer.innerHTML += '<div class="grid-item" id="' + image._id + '"><div class="pic"><div class="img"><img onerror="defaultImage(this);masonry();" src="' 
                + image.imageLink + '"></div><div class="caption"><b>#' 
                + image.caption +'</b></div><div class="info"><div class="avatar info-left" id="' 
                + image.owner_id + '" onclick="getUser(this)"><img src="' 
                + image.ownerPhoto + '"></div>' + deleteDiv + likeDiv + '</div></div></div>';  
                
            
            
        
        }); 
        masonry();
    } else {
        pics.forEach(function(image) {
            gridContainer.innerHTML += '<div class="grid-item" id="' + image._id + '"><div class="pic"><div class="img"><img onerror="defaultImage(this);masonry();" src="' 
                + image.imageLink + '"></div><div class="caption"><b>#' 
                + image.caption +'</b></div><div class="info"><div class="avatar info-left" id="' 
                + image.owner_id + '" onclick="getUser(this)"><img src="' 
                + image.ownerPhoto + '"></div><div class="like info-right"><span><i class="fa fa-heart"></i>  ' 
                + image.likers.length + '</span></div></div></div></div>';
                
            
        });
        masonry();
    } 
}
// default image 
function defaultImage(img) {
    img.onerror = '';
    img.src = 'public/img/1.jpg';
    return true;
}

// get user
function getUser(avatarDiv) {
    var userId = avatarDiv.getAttribute('id');
    
    ajaxRequest('GET', '/api/users/' + userId, function(response) {
        var auth = response.auth,
            pics = response.pics,
            status = response.status;
            
        printList(auth, pics, status);
        
        masonry();
    });
}

// delete 
function deletePic(delDiv) {
    var gridContainer = document.querySelector('.grid');
    var gridItem = delDiv.parentNode.parentNode.parentNode;
    var picId = gridItem.getAttribute('id');
        
    ajaxRequest('DELETE', '/api/pics/' + picId, function(response) {
        gridItem.remove();
            
        masonry();        
    });
}
// like 
function like(likeDiv) {
    var gridItem = likeDiv.parentNode.parentNode.parentNode;
    var picId = gridItem.getAttribute('id');
    
    ajaxRequest('POST', '/api/pics/' + picId, function(response) {
        var likers = response.likers;
        
        likeDiv.className += ' liked';
        likeDiv.children[0].setAttribute('onclick', 'unlike(this.parentNode)');
        likeDiv.children[0].innerHTML = '<i class="fa fa-heart"></i>  ' + likers.length;
        
        masonry();
    });
}
//unlike
function unlike(likeDiv) {
    var gridItem = likeDiv.parentNode.parentNode.parentNode;
    var picId = gridItem.getAttribute('id');
    
    ajaxRequest('PUT', '/api/pics/' + picId, function(response) {
        var likers = response.likers;
        
        likeDiv.classList.remove('liked');
        likeDiv.children[0].setAttribute('onclick', 'like(this.parentNode)');
        likeDiv.children[0].innerHTML = '<i class="fa fa-heart"></i>  ' + likers.length;
    
        masonry();
    });
}

// get my pics
    function getMyPics() {
        ajaxRequest('GET', '/api/mypics', function(response) {
            var pics = response.pics,
                status = response.status;
            
            printList(true, pics, status);
        
            masonry();
        });
        
    }

    // get all pics
    function getAllPics() {
        ajaxRequest('GET', '/api/pics', function(response) {
            var auth = response.auth,
                pics = response.pics,
                status = response.status;
            
            printList(auth, pics, status);
            
            masonry();
        });
    }
//////////////////////
function main() {
    
    var addBtn = document.getElementById('add');
    var linkInp = document.getElementById('link'),
        captionInp = document.getElementById('caption');
    var allPicsBtn = document.getElementById('allPics'),
        myPicsBtn = document.getElementById('myPics');
    
    var gridContainer = document.querySelector('.grid');
    var msnry = new Masonry('.grid', {
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer',
                percentPosition: true
            });
    
    console.log('masonry');
    imagesLoaded(gridContainer).on( 'progress', function() {
        // layout Masonry after each image loads
        msnry.layout();
    });
    
    
    // add a new pic
    function addPic() {
        var gridContainer = document.querySelector('.grid');
        var link = linkInp.value,
            caption = captionInp.value;
        var postData = 'link=' + link + '&caption=' + caption;
        
        ajaxPost('/api/addpic', postData, function(data) {
            var image = data.newPic;
            
            gridContainer.innerHTML += '<div class="grid-item" id="' + image._id + '"><div class="pic"><div class="img"><img onerror="defaultImage(this);masonry();" src="' 
                + image.imageLink + '"></div><div class="caption"><b>#' 
                + image.caption +'</b></div><div class="info"><div class="avatar info-left"><img src="' 
                + image.ownerPhoto + '"></div><div class="delete info-left"><span onclick="deletePic(this.parentNode)"><i class="fa fa-times"></i></span></div><div class="like info-right"><span onclick="like(this.parentNode)"><i class="fa fa-heart"></i>  ' 
                + image.likers.length + '</span></div></div></div></div>';
            
            masonry();        
        });
    }
    
    getAllPics();
    
    allPicsBtn.addEventListener('click', getAllPics);
    myPicsBtn.addEventListener('click', getMyPics);
    
    //
    addBtn.addEventListener('click', addPic);
    linkInp.onkeypress = function(event) {
        if (event.keyCode === 13 || event.which === 13)
            addPic();
    };
    captionInp.onkeypress = function(event) {
        if (event.keyCode === 13 || event.which === 13)
            addPic();
    };
    ////
    
}

ready(main);