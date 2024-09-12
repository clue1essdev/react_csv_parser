import { useState, useEffect } from "react";
import Papa from "papaparse"; // парсер .csv файлов
import "./App.css";
/* Read README.md */

//Index,Customer Id,First Name,Last Name,Company
function App() {
  const [fields, setFields] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [inputRowsValue, setInputRowsValue] = useState("");
  const [rowsQuantity, setRowsQuantity] = useState(30); // максимальное количество рядов в таблице на странице, по умолчанию 30

  // функция парсит .csv файл из папки public и заисывает первые пять столбцов каждого ряда в двумерный массив data
  const getCSV = () => {
    const rows = [];
    let counter = 0;
    Papa.parse("/customers-100000.csv", {
      download: true,
      skipEmptyLines: true,
      delimiter: ",",
      step: function (results) {
        if (counter === 0) {
          setFields([
            results.data[1],
            results.data[2],
            results.data[3],
            results.data[4],
            results.data[5],
          ]);
          counter++;
        } else {
          rows.push([
            results.data[1],
            results.data[2],
            results.data[3],
            results.data[4],
            results.data[5],
          ]);
        }
      },
      complete: () => {
        setData(rows);
      },
    });
  };

  // для экономии ресурсов функция создает массив поменьше в соответствии с номером страницы и количеством рядов в таблице, чтобы рендерить только их
  const createSmallArray = () => {
    let leftIndex =
      page === Math.ceil(data.length / rowsQuantity)
        ? Math.floor(data.length / rowsQuantity) === data.length / rowsQuantity // проверяем является ли количество рядов таблицы целым делителем числа элементов
          ? Math.floor(data.length / rowsQuantity) * rowsQuantity - rowsQuantity
          : Math.floor(data.length / rowsQuantity) * rowsQuantity
        : (page - 1) * rowsQuantity;
    let rightIndex =
      page === Math.ceil(data.length / rowsQuantity)
        ? data.length - 1
        : (page - 1) * rowsQuantity + rowsQuantity - 1;
    const newArr = [];
    for (let i = leftIndex; i < rightIndex + 1; i++) {
      newArr.push(data[i]);
    }
    return newArr;
  };

  // обработка пользовательского ввода номера страницы,
  // условия - введенный номер страницы должен быть меньше единицы и больше числа страниц
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (
      !isNaN(event.target.value) &&
      /^\d+$/.test(event.target.value) &&
      Number(event.target.value) < Math.ceil(data.length / rowsQuantity) + 1 &&
      Number(event.target.value) > 0
    ) {
      setPage(Number(event.target.value));
    }
  };

  // то же самое, только для ввода числа рядов в таблице
  const handleInputRowsChange = (event) => {
    setInputRowsValue(event.target.value);
    setPage(1); // здесь устанавливаем страницу на первую, чтобы не выйти за пределы числа страниц после изменения числа рядов
    setInputValue(""); // очищаем ввод для страницы по той же причине
    if (
      !isNaN(event.target.value) &&
      /^\d+$/.test(event.target.value) &&
      Number(event.target.value) < 501 &&
      Number(event.target.value) > 9
    ) {
      setRowsQuantity(Number(event.target.value));
    }
  };

  // вызов парсера
  useEffect(() => {
    getCSV();
  }, []);

  return (
    <>
      {data ? (
        <div className="page">
          <p>Решение тестового задания Безымянной компании</p>
          <p>Автор решения - Тамерлан Халилов</p>
          <a href="https://www.datablist.com/learn/csv/download-sample-csv-files" target="_blank">Ссылка на источник .csv сэмпла</a>
          <h2>Постраничная таблица из .csv файла</h2>
          <div className="controls">
            <div className="rows-quntity-form-container">
              <div>
                <p>Введите желаемое количество рядов таблицы</p>
                <p>для отображения на странице</p>
                <p>(для экономии ресурсов значение не может быть больше 500)</p>
                <p>минимальное значение - 10, значение по умолчанию - 30</p>
              </div>
              <div className="rows-quntity-from">
                <input
                  id="input-1"
                  placeholder="Введите значение"
                  type="text"
                  value={inputRowsValue}
                  onChange={handleInputRowsChange}
                />

                <button
                  onClick={() => {
                    setRowsQuantity(30);
                    setInputRowsValue("");
                    setPage(1);
                    setInputValue("");
                  }}
                >
                  Вернуть значение по умолчанию
                </button>
              </div>
            </div>
            <div className="pages-controls-container">
              <input
                id="input-2"
                placeholder="Введите номер страницы"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
              />
              <div className="arrow-btn-container">
                <button
                  onClick={() => {
                    setInputValue("");
                    if (page > 1) setPage(page - 1);
                  }}
                >
                  <img src="/arrow-left-svgrepo-com.svg"></img>
                </button>
                <button
                  onClick={() => {
                    setInputValue("");
                    if (page < Math.ceil(data.length / rowsQuantity))
                      setPage(page + 1);
                  }}
                >
                  <img src="/arrow-right-svgrepo-com.svg"></img>
                </button>
              </div>
            </div>
          </div>
          <p className="pages">
            Страница {page} / {Math.ceil(data.length / rowsQuantity)}
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>{fields[0]}</th>
                <th>{fields[1]}</th>
                <th>{fields[2]}</th>
                <th>{fields[3]}</th>
                <th>{fields[4]}</th>
              </tr>
            </thead>
            <tbody>
              {/*рендерим только кусочек массива, который хотим отобразить*/}
              {createSmallArray().map((row, index) => (
                <tr key={index}>
                  <td>{index + rowsQuantity * (page - 1) + 1}</td>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h2>Подождите, читаем файл...</h2>
      )}
    </>
  );
}

export default App;
