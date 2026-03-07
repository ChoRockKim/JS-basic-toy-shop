//<!--상품 파일 ajax 요청 후 끼워넣기, 데이터바인딩-->
var itemArray;
var howMany = [0, 0, 0, 0];
var totalPrice = 0;




fetch('./store.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    itemArray = data.products;
    itemArray.forEach((datas, i) => {
        var items = `<img class="img-box" src="${datas.photo}" draggable="false">
                    <div class="item-content">
                        <p class="item-title">${datas.title}</p>
                        <p class="item-producer">${datas.brand}</p>
                        <p class="item-price">가격 : ${datas.price}</p>
                        <button class="pick">담기</button>
                    </div>`;
        
        document.querySelectorAll('.item')[i].insertAdjacentHTML('beforeend', items);
    });
}); 

//검색기능 구현
document.querySelector('#search').addEventListener('input', function(e){
    var cur_search = e.target.value;
    //검색어 == 글자 제목이면 해당하는 상품만 보여줌
    // 공백은 미포함
    if (cur_search != '' && cur_search != ' ') {
        itemArray.forEach((data, i) => {
            var name = data.title;
            new_name = name.replace(cur_search, `<span style="background: yellow">${cur_search}</span>`)

            var items = `<div class="item show" draggable="true">
                            <img class="img-box" src="${data.photo}" draggable="false">
                            <div class="item-content">
                                <p class="item-title">${new_name}</p>
                                <p class="item-producer">${data.brand}</p>
                                <p class="item-price">가격 : ${data.price}</p>
                                <button class="pick">담기</button>
                            </div>
                        </div>`;
            if (data.title.includes(cur_search)) {
                $('.item-container').html('');
                $('.item-container').html(items);
                console.log(cur_search);
            } 
        });
    }
    //공백이면 초기화
    else {
        $('.item-container').html('')
        itemArray.forEach((data, i) =>{
            var items = `<div class="item show" draggable="true">
                    <img class="img-box" src="${data.photo}" draggable="false">
                    <div class="item-content">
                        <p class="item-title">${data.title}</p>
                        <p class="item-producer">${data.brand}</p>
                        <p class="item-price">가격 : ${data.price}</p>
                        <button class="pick">담기</button>
                    </div>
                </div>`;
            document.querySelector('.item-container').insertAdjacentHTML('beforeend',items);
        });
        DragAndDrop();
        pickAdd();
    }
});

//드래그 앤 드롭 이벤트 구현
function DragAndDrop() {
    //clonedItem(장바구니) 의 내부 css 변경
    function changeShape(clone, dropbox) {
                clone.style.color='black';
                clone.querySelector('.pick').remove();
                clone.style.borderRadius = '8px';
                clone.style.height = '300px';
                clone.style.width = '180px';
                clone.insertAdjacentHTML('beforeend', `<div class= "howMuch"></div>`)
                dropbox.appendChild(clone);
    }

//    var howMany = [0, 0, 0, 0];
//    var totalPrice = 0;


    for (let i=0; i<4; i++) {
        let container = document.querySelectorAll('.item')[i];
        const dropbox = document.querySelector('.drag-section');

        var dragNum = null;

        container.addEventListener('dragover', function(e){
            e.preventDefault();
            dragNum = i;
        });

        dropbox.addEventListener('dragover', function(e){
            e.preventDefault();
        });

        var clonedItem;

        dropbox.addEventListener('drop', function(){
            if (dragNum == i) {
                if (howMany[i] == 0) {
                    howMany[i] += 1;
                    console.log(howMany);
                    console.log('장바구니 담기 성공!');

                    clonedItem = container.cloneNode(true); 
                    clonedItem.id = 'cart-item' + i;
                    if (dropbox.querySelector('span') != null){
                        dropbox.querySelector('span').remove();
                    }
                    changeShape(clonedItem, dropbox);
                    clonedItem.querySelector('.howMuch').innerHTML = howMany[i];
                    dragNum = null;
                } 

                else {
                    clonedItem = container.cloneNode(true); 
                    howMany[i] += 1;
                    var itemInCart = document.querySelector('#cart-item'+i);
                    itemInCart.querySelector('.howMuch').innerHTML = howMany[i];
                    console.log(howMany);
                }

                var itemPrice = clonedItem.querySelector('.item-price').innerHTML;
                var onlyPrice = itemPrice.split(' ')[2]
                console.log(onlyPrice);
                totalPrice += parseInt(onlyPrice);
                document.querySelector('.priceInformation').innerHTML= `: ${totalPrice}원`;
            }
        });
    }
}

DragAndDrop();

    
// 구매 누를 시 모달 창 뜨게
document.querySelector('.buy').addEventListener('click', function(){
   document.querySelector('.modal-screen').classList.add('opacity'); 
});

document.querySelector('.quit').addEventListener('click', function() {
   document.querySelector('.modal-screen').classList.remove('opacity'); 
});

document.querySelector('.dark-bg').addEventListener('click', function(e) {
    if (e.target == document.querySelector('.dark-bg')) {
        document.querySelector('.modal-screen').classList.remove('opacity'); 
    }
});

//담기 버튼 누를 시 장바구니에 추가되게
function pickAdd() {
    setTimeout(()=>{
        for (var i=0; i<4; i++) {
            document.querySelectorAll('.pick')[i].addEventListener('click', function(e){
                var price = e.target.previousElementSibling.innerHTML.split(' ')[2];
                console.log(price)
                totalPrice += parseInt(price);
                document.querySelector('.priceInformation').innerHTML= `: ${totalPrice}원`;  
            });
        }
    }, 500);
}

pickAdd()