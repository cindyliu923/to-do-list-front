function clickTodo() {
  let addtodo = document.getElementById("add-todo");
  let add = document.getElementById("add");
  let field = document.getElementById("todoForm");
  let addbutton = document.getElementById("add-button");
  let savebutton = document.getElementById("save-button");
  document.getElementsByClassName("card-header")[0].style.background = "#F2F2F2";
  document.getElementsByClassName("open-star")[0].className = "far fa-star open-star";
  field.elements["star"].value = "";
  $("#done").removeAttr('checked');
  $('.file-name').empty();
  $('input[type="date"]').css('color', '#C8C8C8');
  $('input[type="time"]').css('color', '#C8C8C8');

  if (addtodo.style.display === "none") {
    addtodo.style.display = "block";
    add.style.display = "none";
    addbutton.style.display = "block";
    savebutton.style.display = "none";
    field.removeAttribute("class");
    field.reset();
  } else {
    addtodo.style.display = "none";
    add.style.display = "block";
  }
}

function editItem(number) {
  let item = JSON.parse(localStorage.getItem("todoList")).todo[number];
  let field = document.getElementById("todoForm");
  let addbutton = document.getElementById("add-button");
  let savebutton = document.getElementById("save-button");
  let checkbox = document.getElementsByTagName("input").done

  window.scrollTo(0, 0);

  clickTodo();
  addbutton.style.display = "none";
  savebutton.style.display = "block";

  $.each(item, function(key, value) {
    if (key === "file"){
      const dT = new ClipboardEvent('').clipboardData || // Firefox < 62 workaround exploiting https://bugzilla.mozilla.org/show_bug.cgi?id=1422655
      new DataTransfer(); // specs compliant (as of March 2018 only Chrome)
      // console.log(dT.items);
      dT.items.add(new File(["file"], value["fileName"], {type: value["fileType"], lastModifiedDate: value["fileLastModifiedDate"]}));
      todoItemFile.files = dT.files;
      // console.log(todoItemFile);
      $('.file-name').html(value["fileName"]);

    } else if (key === "star" && value === "true") {
      document.getElementsByClassName("card-header")[0].style.background = "#FFF2DC";
      document.getElementsByClassName("open-star")[0].className += (" "+number+" fas fa-star");
      field.elements[key].value = value;
    } else if (key === "done" && value === "on") {
      checkbox.setAttribute("checked", "checked");
      field.elements[key].value = value;
    } else if (key === "date" || key === "time") {
      if (value !== ""){
        $('input[type="date"]').css('color', 'black');
        $('input[type="time"]').css('color', 'black');
      } else {
        $('input[type="date"]').css('color', '#C8C8C8');
        $('input[type="time"]').css('color', '#C8C8C8');
      }
      field.elements[key].value = value;
    } else {
      field.elements[key].value = value;
    }
  });

  // 為了更新設定 class number
  field.setAttribute("class", number);
}

window.onload = function() {

  const todoForm = document.querySelector("#todoForm");
  const itemsList = document.querySelector(".todos");
  const itemsDoing = document.querySelector(".doing");
  const itemsDone = document.querySelector(".done");
  const savebutton = document.getElementById("save-button");
  const todoHeader = document.getElementsByClassName("card-header")[0];
  const openStar = document.getElementsByClassName("open-star")[0]

  const data = (localStorage.getItem("todoList")) ?
    JSON.parse(localStorage.getItem("todoList")):
    { todo: [] };

  function clickStar(e) {

    let starIndex = (this.className[0] === "f" && todoForm.className !== "") ?
      Number(todoForm.className) : (this.className[0] === "f" && todoForm.className === "") ?
      data.todo.length : Number(this.className[0]+this.className[1])

    let star = document.getElementsByClassName(starIndex+" fa-star")[0]

    let starItem = document.getElementById(starIndex);

    if (starIndex === data.todo.length && todoForm.elements["star"].value === "") {

      todoForm.elements["star"].value = "true";
      this.className = "fas fa-star open-star";
      todoHeader.style.background = "#FFF2DC";

    } else if (starIndex === data.todo.length && todoForm.elements["star"].value !== "") {

      todoForm.elements["star"].value = "";
      this.className = "far fa-star open-star";
      todoHeader.style.background = "#F2F2F2";

    } else if (data.todo[starIndex]["star"] === "true"){

      data.todo[starIndex]["star"] = "false"
      todoForm.elements["star"].value = "false";

      starItem.style.background = "#F2F2F2";
      todoHeader.style.background = "#F2F2F2";

      star.className = starIndex+" far fa-star";
      openStar.className = "far fa-star open-star";

    } else {

      data.todo[starIndex]["star"] = "true"
      todoForm.elements["star"].value = "true";

      starItem.style.background = "#FFF2DC";
      todoHeader.style.background = "#FFF2DC";

      star.className = starIndex+" fas fa-star";
      openStar.className = "fas fa-star open-star";

    }

    sortdata();

  }

  function addItem(e) {
    // 加上preventDefault()避免每次 submit 都會重整網頁
    e.preventDefault();

    let index = todoForm.className
    let file = document.getElementById("todoItemFile").files[0] || '';
    let todoData = (file === '') ? {} : { file:{} };

    $.each($("#todoForm").serializeArray(), function(i, field) {
      todoData[field.name] = field.value;
    });
    // console.log(file);

    if (file !== ''){
      todoData.file["fileName"] = file.name
      todoData.file["fileSize"] = file.size
      todoData.file["fileType"] = file.type
      todoData.file["fileLastModifiedDate"] = file.lastModifiedDate
    }
    if (savebutton.style.display === "none") {
      data.todo.push(todoData);
    } else {
      data.todo[index] = todoData;
    }

    // 清空輸入欄位
    this.reset();
    clickTodo();

    sortdata();
  }

  function sortdata() {
    data.todo.sort(function (x, y) {
      return (x.star === y.star) ? x.index-y.index : x.star === "true" ? -1 : 1;
    });

    todoitemList(data);
    localStorage.setItem("todoList", JSON.stringify(data));
  }

  function checked() {
    let id = this.parentNode.parentNode.parentNode.parentNode.id
    if($(this).is(':checked')) {
      data.todo[id]["done"] = "on"
    } else {
      data.todo[id]["done"] = ""
    }

    todoitemList(data);
    localStorage.setItem("todoList", JSON.stringify(data));
  }

  function upload() {
    let file = document.getElementById("todoItemFile").files[0]
    $('.file-name').html(file["name"]);
  }

  function todoitemList(data = {}) {
    let doingData = []
    let doneData = []

    data.todo.map((todo, i) => {
      if (todo.done === "on"){
        doneData.push(todo)
      } else {
        doingData.push(todo)
      }
    });

    let doingQuantity = doingData.length
    let doneQuantity = doneData.length

    // 使用 map 搭配 join 來組成字串，並顯示在 html 的清單中
    itemsList.innerHTML = data.todo.map((todo, i) => {
      return `
        <div class="todo-item" id="${i}" ${ todo.star === "true" ? 'style="background: #FFF2DC"' : '' }>
          <div class="input-group col-md-12">
            <div class="to-do-header">
              <label class="customcheck">
                <input name="done" class="done" type="checkbox" ${todo.done ? 'checked' : ''}/>
                <div class="label">${todo.title}</div>
                <span class="checkmark"></span>
              </label>
            </div>
            <i class="${ todo.star === "true" ? i+' fas fa-star' : i+' far fa-star'}"></i>
            <i class="fas fa-pen" onclick="editItem(${i})"></i>
          </div>
          <span class="divider"></span>
          <div class="todo-fa">
            ${todo.date ? ('<i class="far fa-calendar-alt">'+' '+todo.date[5]+todo.date[6]+'/'+todo.date[8]+todo.date[9]+'</i>') : '' }
            ${todo.file ? ('<i class="far fa-file"></i>') : '' }
            ${todo.comment ? ('<i class="far fa-comment-dots"></i>') : '' }
          </div>
        </div>
        ${ i === data.todo.length-1 ? ('<div class="doing-quantity">'+doingQuantity+' tasks left</div>') : '' }
      `;
    }).join('');

    itemsDoing.innerHTML = data.todo.map((todo, i) => {
      if (todo.done !== "on") {
      return `
        <div class="todo-item" id="${i}" ${ todo.star === "true" ? 'style="background: #FFF2DC"' : '' }>
          <div class="input-group col-md-12">
            <div class="to-do-header">
              <label class="customcheck">
                <input name="done" class="done" type="checkbox" ${todo.done ? 'checked' : ''}/>
                <div class="label">${todo.title}</div>
                <span class="checkmark"></span>
              </label>
            </div>
            <i class="${ todo.star === "true" ? i+' fas fa-star' : i+' far fa-star'}"></i>
            <i class="fas fa-pen" onclick="editItem(${i})"></i>
          </div>
          <span class="divider"></span>
          <div class="todo-fa">
            ${todo.date ? ('<i class="far fa-calendar-alt">'+' '+todo.date[5]+todo.date[6]+'/'+todo.date[8]+todo.date[9]+'</i>') : '' }
            ${todo.file ? ('<i class="far fa-file"></i>') : '' }
            ${todo.comment ? ('<i class="far fa-comment-dots"></i>') : '' }
          </div>
        </div>
        ${ todo === doingData[doingQuantity-1] ? ('<div class="doing-quantity">'+doingQuantity+' tasks left</div>') : '' }
      `;}
    }).join('');

    itemsDone.innerHTML = data.todo.map((todo, i) => {
      if (todo.done === "on") {
      return `
        <div class="todo-item" id="${i}" ${ todo.star === "true" ? 'style="background: #FFF2DC"' : '' }>
          <div class="input-group col-md-12">
            <div class="to-do-header">
              <label class="customcheck">
                <input name="done" class="done" type="checkbox" ${todo.done ? 'checked' : ''}/>
                <div class="label">${todo.title}</div>
                <span class="checkmark"></span>
              </label>
            </div>
            <i class="${ todo.star === "true" ? i+' fas fa-star' : i+' far fa-star'}"></i>
            <i class="fas fa-pen" onclick="editItem(${i})"></i>
          </div>
          <span class="divider"></span>
          <div class="todo-fa">
            ${todo.date ? ('<i class="far fa-calendar-alt">'+' '+todo.date[5]+todo.date[6]+'/'+todo.date[8]+todo.date[9]+'</i>') : '' }
            ${todo.file ? ('<i class="far fa-file"></i>') : '' }
            ${todo.comment ? ('<i class="far fa-comment-dots"></i>') : '' }
          </div>
        </div>
        ${ todo === doneData[doneQuantity-1] ? ('<div class="doing-quantity">'+doneQuantity+' task completed</div>') : '' }
      `;}
    }).join('');
  }

  // 監聽submit按鈕
  todoForm.addEventListener('submit', addItem);

  // $('.fa-star').click(starItem);
  // $('.fa-star').on('click', starItem);
  $(document).on('click', '.fa-star', clickStar);
  $(document).on('change', '.done', checked);
  $(document).on('change', '#todoItemFile', upload);

  // 顯示 todo list
  // todoitemList(data);
  sortdata();

  $( "#pills-my-tasks" ).sortable();
  $( "#pills-my-tasks" ).disableSelection();
  $( "#pills-in-progress" ).sortable();
  $( "#pills-in-progress" ).disableSelection();
  $( "#pills-completed" ).sortable();
  $( "#pills-completed" ).disableSelection();
}
