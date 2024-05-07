let productsList = [];
let sepetList = [];

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

const toggleModel =()=>{
    const sepetModel = document.querySelector(".sepet_model");
    sepetModel.classList.toggle("active");
};

const getProducts = () => {
    fetch("./products.json")
    .then(res =>res.json())
    .then( (products) => (productsList = products) );

}
getProducts();

const createProductItemsHtml = () => {
    const productListEl = document.querySelector(".product_list");
    let productListHtml = "";
    productsList.forEach( (product,index) => {
        productListHtml += `<div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
        <div class="row product_card">
          <div class="col-6"> 
            <img class="img-fluid shadow" 
            src = "${product.imgSource}"
            width="258" 
            height="400" 
            />
          </div>
          <div class="col-6 d-flex flex-column justify-content-between degistir" >
            <div class="product_detail">
              <span class="fos gray fs-6">${product.category}</span><br>
              <span class="fs-5 fw-bold">${product.name}</span><br>
              <span></span>
            </div>
            <p class="product_description fos gray">
              ${product.description}
            </p>
            <div>
              <span class="black fw-bold fs-5 ">${product.price}₺</span>
            </div>
            
            <button class="btn_purple"  onclick="addProductToSepet(${product.id})">Sepete Ekle</button>
            <button class="btn_purple  AyrintilaraGit " ><a href="${product.htmlSource}" >Ayrıntılara Git</a></button>         
          </div>
        </div>
      </div>`;
    });

    productListEl.innerHTML =  productListHtml;
};

const PRODUCT_TYPES = {
    ALL : "Tümü" ,
    BUZDOLABI : "Buzdolabı" ,
    KOLTUK : "Koltuk / Kanape",
    CAMASIR : "Çamasır Makinesi",
    BULASIK : "Bulaşık Makinesi",
    FIRIN : "Fırın / Ocak"


};

const createProductTypesHtml = () => {

    const filterEl = document.querySelector(".filter");
    let filterHtml = "";

    let filterTypes = ["ALL"];
    productsList.forEach(product => {
        if(filterTypes.findIndex(filter => filter == product.type ) == -1) filterTypes.push(product.type);
    });
    filterTypes.forEach((type , index  )=> {
        filterHtml += `<li class="${index == 0 ? "active" : null}" onclick="filterProducts(this)" data-type="${type}">${
            PRODUCT_TYPES[type] || type }</li>`;
    });

    filterEl.innerHTML = filterHtml;
};

const filterProducts = (filterEl) => {
    document.querySelector(".filter .active").classList.remove("active");
    filterEl.classList.add("active")
    let productType = filterEl.dataset.type;
    getProducts();
    if(productType !=  "ALL") 
        productsList = productsList.filter(product => product.type == productType);
    createProductItemsHtml();
};


const listSepetItems = () => {
  console.log(sepetList);
  const sepetListEl = document.querySelector(".sepet_list");
 const totalPriceEl=document.querySelector(".total_price") ;
  let sepetListHtml = "";
  let totalprice=0;
  sepetList.forEach((item) => {
    console.log(item.addedItem.productA.id);
    totalprice=totalprice+item.addedItem.quantity*item.addedItem.productA.price;
    sepetListHtml += `<li class="sepet_item">
    <img 
      src="${item.addedItem.productA.imgSource}" 
      width= "100" 
      heigth = "100" 
      alt=""
    />
    <div class="sepet_item_info"> 
      <h3 class="sepet_item_name">${item.addedItem.productA.name}</h3>
      <span class="sepet_item_price">${item.addedItem.productA.price}TL</span><br>
      <span class="sepet_item_remove" onclick="removeItemToBasket(${item.addedItem.productA.id})">Sil</span>
    </div>
    <div class="sepet_count">
      <span class="decrease" onclick="decreaseItemToBasket(${item.addedItem.productA.id})">-</span>
      <span >${item.addedItem.quantity}</span>
      <span class="increase" onclick="increaseItemToBasket(${item.addedItem.productA.id})">+</span>
    </div>
  </li>`;
  });
  sepetListEl.innerHTML = sepetListHtml;
  totalPriceEl.innerHTML=totalprice>0?"Toplam Tutar:"+totalprice.toFixed(2)+" ₺":null;
};


const addProductToSepet = (productId) => {
  console.log(productId);
  let isthere=null;
  let findedProduct =  productsList.find((product) => product.id == productId);
  if(findedProduct){
    console.log(findedProduct.id)
    sepetList.forEach((item) => {
      if(item.addedItem.productA.id==findedProduct.id)
      {
        console.log("artı");
        if(item.addedItem.quantity!=item.addedItem.productA.stock)
        {
          item.addedItem.quantity+=1;
          toastr.success("Başarıyla eklendi.");
          isthere=true;
          return false;
        }
        else{
          toastr.error("Stokta bulunamadı.");
          isthere=true;
          return false;
            }
      }
    });
    if(isthere!=true)
    {
      console.log("yeni");
      let addedItem =  {quantity:1, productA:findedProduct};
      sepetList.push({addedItem});
      toastr.success("Başarıyla eklendi.");
    }
    listSepetItems();
  } 
};


const removeItemToBasket=(productId)=>{
  const findedIndex=sepetList.findIndex(sepet=>sepet.addedItem.productA.id==productId);
  if(findedIndex!=-1)
  {
    sepetList.splice(findedIndex,1);
  }
  listSepetItems();
}


const decreaseItemToBasket=(productId)=>{
  const findedIndex=sepetList.findIndex((basket) => basket.addedItem.productA.id==productId);
  if(findedIndex!=-1){
    if(sepetList[findedIndex].addedItem.quantity!=1)
    {
      sepetList[findedIndex].addedItem.quantity-=1;
    }
    else{
      removeItemToBasket(productId);
    }
  }
  listSepetItems();

}

const increaseItemToBasket=(productId)=>{
  const findedIndex=sepetList.findIndex((basket) => basket.addedItem.productA.id==productId);
  console.log(findedIndex);
  if(findedIndex!=-1){
    if(sepetList[findedIndex].addedItem.quantity!=sepetList[findedIndex].addedItem.productA.stock)
    {
      sepetList[findedIndex].addedItem.quantity+=1;
    }
    else{
      toastr.error("Stokta bulunamadı.");
    }
  }
  listSepetItems();

}




setTimeout(() => {
    createProductItemsHtml();
    createProductTypesHtml();
} , 200);
