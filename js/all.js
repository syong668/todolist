//取得DOM
const addBtn = document.querySelector("#addBtn")
const inputTodo = document.querySelector("#inputTodo") // 新增的內容
const todoListAll = document.querySelector("#todoListAll") // 待辦列表(ul)

let todoData = JSON.parse(localStorage.getItem('todoItem')) || [] //取出存在localStorage裡的資料並轉為陣列(無資料則為空值)

// 新增待辦
addBtn.addEventListener("click", (e) => {
    e.preventDefault()
    let newTodo = {
        content: inputTodo.value,
        checked: '',
        id: new Date().getTime()
    }
    //trim()去除前後空白，以免新增了空白事項
    if(newTodo.content.trim() !== '') {
        todoData.unshift(newTodo)
    }else {
        alert('待辦事項不得為空')
    }
    inputTodo.value = '' //新增後清空輸入框(避免連續新增)
    localStorage.setItem('todoItem',JSON.stringify(todoData)) // 存入localStorage作更新(要轉為字串)
    updataList() //更新資料並重新渲染
})

// 初始
updataTodo()
// 渲染待辦
function updataTodo(data = todoData) {
    let todoListHtml = ``
    if(data.length == 0) {
        todoListAll.innerHTML = `<li><h3>來新增你的todo吧(✪ω✪)</h3></li>`
    }else {
        data.forEach((item,key) => {
            todoListHtml += `
            <li>
                <label data-num="${item.id}" data-type="check" class="checkbox" for="${item.id}">
                    <input data-num="${item.id}" data-type="check" ${item.checked} type="checkbox" id="${item.id}}" />
                    <span data-num="${item.id}" data-type="check">${item.content}</span>
                </label>
                <a class="delete" href="#" data-num="${item.id}">
                    <svg
                        class="delete"
                        data-num="${item.id}"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        class="iconify iconify--material-symbols"
                        width="24"
                        height="24"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                    >
                        <path
                            class="delete"
                            data-num="${item.id}"
                            fill="currentColor"
                            d="M9.875 17.525L12 15.4l2.125 2.125l1.4-1.4L13.4 14l2.15-2.125l-1.425-1.4L12 12.6l-2.125-2.125l-1.4 1.4L10.6 14l-2.125 2.125ZM5 6V4h3.5l1-1h5l1 1H19v2Zm3 15q-.825 0-1.412-.587Q6 19.825 6 19V7h12v12q0 .825-.587 1.413Q16.825 21 16 21Z"
                        ></path>
                    </svg>
                </a>
            </li>`
        })
    

        todoListAll.innerHTML = todoListHtml
    }

}

// 刪除待辦 & 已完成代辦
todoListAll.addEventListener("click", (e) => {
    //取得編號、位置
    let id = e.target.getAttribute('data-num') //取得點選的id
    let allID = todoData.map((item) => {return item.id}) //取得目前所有id
    let num = allID.indexOf(Number(id)) //取得id的位置(自訂屬性返回的是字串，轉換型別才能比對)
    console.log('id:'+id,'所有id:'+allID,'id位置:'+num)

    //依照所定義的class判斷執行 刪除 or 已完成 
    if(e.target.getAttribute('class') == 'delete') { 
        e.preventDefault()
        todoData.splice(num, 1)
        localStorage.setItem('todoItem',JSON.stringify(todoData));
        updataList()

    } else if (e.target.getAttribute('data-type') == 'check') {
        if ( todoData[num].checked == ''){
            todoData[num].checked = 'checked'
            localStorage.setItem('todoItem',JSON.stringify(todoData));
            updataList()
        }else {
            todoData[num].checked = ''
            localStorage.setItem('todoItem',JSON.stringify(todoData));
            updataList()
        }
    }
})

// 切換分類
const tab = document.querySelector("#tab")
let activeStatus = 'all' //當前查看的分類
tab.addEventListener("click", (e) => {
    activeStatus = e.target.getAttribute('data-status') // 切換的分類
    let tabs = document.querySelectorAll("#tab li") // 取得所有分類dom
    //樣式切換
    tabs.forEach((item)=>{
        // 與目前切換的分類符合，就添加active的樣式
        if(item.getAttribute('data-status') == activeStatus) {
            item.classList.add('active')
        //若不符合，就將曾經賦予active的樣式都移除
        }else {
            item.classList.remove('active')
        }
    })
    updataList()
})

//更新: 依分類切換資料
function updataList() {
    let activeData = []
    if(activeStatus == 'doing') {
        activeData = todoData.filter((item) => { return item.checked == '' })
    }else if( activeStatus == 'done') {
        activeData = todoData.filter((item) => { return item.checked == 'checked' })
    }else if ( activeStatus == 'all') {
        activeData = todoData
    }
    console.log('當前分類:'+ activeStatus,activeData)
    updataTodo(activeData)
}