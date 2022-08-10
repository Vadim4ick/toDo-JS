const newItemText = document.getElementById("newItemText");
const addForm = document.getElementById("addForm");
const items = document.getElementById("items");
const filter = document.getElementById("filter");

//====================================  Добавление ==================================

// Функция рендера, в которую передаю текст который написал в инпуте и вывожу вначало html списка
function renderItem(inpText) {
  const markup = `
    <li class="list-group-item">
    <p>${inpText}</p>
    <button
        data-action="delete"
        type="button"
        class="btn btn-light btn-sm float-right"
    >
        Удалить
    </button>
  </li>
  `;

  items.insertAdjacentHTML("afterbegin", markup);
}

//При отправке формы я отменяю ее стандартное действие и запускаю функцию рендера, в которую передаю текст из инпута.
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (newItemText.value !== "") {
    renderItem(newItemText.value);
  }
  newItemText.value = "";
});

//====================================  Удаление ====================================

//Вешаю событие клик на весь список задач
items.addEventListener("click", (e) => {
  //Если клик произошел по кнопки, у которой data атрибут action с названием делит, то:
  if (e.target.dataset.action === "delete") {
    //Создаю предупреждающее окно.
    const warning = confirm("Точно хотите удалить??");

    //Если пользователь нажал "ок", то вернется true, а значит я ищу родителя нажатой кнопки и удаляю полность. элемент
    if (warning) {
      const parent = e.target.closest(".list-group-item");
      parent.remove();
    }
  }
});

//====================================  Фильтрация ==================================

//Вешаю событие инпут.
filter.addEventListener("input", function (e) {
  //При каждом изменении инпута, я нахожу все свои задачи
  const tasks = items.querySelectorAll("li");

  // Получаю значение инпута, убрав пробелы
  let val = this.value.toLowerCase().trim();

  //Если у нас в поле что то есть, тогда:
  if (val !== "") {
    //Перебираю все свои задачи
    tasks.forEach((el) => {
      //В константу текст получаю тег p (Чистый текст в задачи, без кнопки "Удалить")
      const text = el.querySelector("p");

      //Делаю проверку, если у нас при совпадении текста в инпуте и текста задачи возвращается -1 (-1 - значит совпадений нет)
      if (text.innerText.toLowerCase().search(val) == -1) {
        //Тогда скрываю элемент
        el.style.display = "none";
      } else {
        //Иначе, если есть совпадения, тогда показываю элемент
        el.style.display = "block";

        //Текст задачи переписываю (ОБЯЗАТЕЛЬНО с innerHTML, ибо будут добавляться span для подсвечивания). Запускаю функцию и передаю в аргументы: 1)Чистый текст задачи, 2)Место в котором произошло совпадение 3) длинну своего значения из инпут
        text.innerHTML = insertMark(
          text.innerText,
          text.innerText.toLowerCase().search(val),
          val.length
        );
      }
    });
  } else {
    //Если у нас поле пустое, тогда делаю перебор элементов, получаю чистый текст задач, делаю все элементы блочными и приравниваю текст задачи к своему тексту.
    tasks.forEach((el) => {
      const text = el.querySelector("p");
      el.style.display = "block";

      text.innerHTML = text.innerText;
    });
  }
});

//Функция подкрашивания.
function insertMark(string, pos, len) {
  // console.log(string.slice(0, pos));
  return (
    //Вводимая нами строка, забираем количество символов от начала строки до начала совпадения и приплюсовываю начало span, дальше от позиции до количества нами вводимых символов, и от количества нами вводимых символов до самого конца (Без второго параметра).

    string.slice(0, pos) +
    `<span>` +
    string.slice(pos, pos + len) +
    `</span>` +
    string.slice(pos + len)
  );
}
