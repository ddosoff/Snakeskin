## v5.1.9

- [x] Исправлена ошибка при переопределении параметров трансляции в дочернем шаблоне.

## v5.1.8

- [x] Обновлена версия `Escaper` в сборке.

## v5.1.7

- [x] Исправлена ошибка с генерацией `:inline` узла в `renderMode = 'dom'`.

## v5.1.6

- [x] Исправление ошибок в механизме экранирования спецсимволов.

## v5.1.5

- [x] Исправлена ошибка node.js кеша при подключении файлов.

## v5.1.4

- [x] Изменено сообщение об успешной операции в CLI API.

## v5.1.3

- [x] Исправлена ошибка при удалении файла в режиме `--watch`.

## v5.1.2

- [x] Исправления мелких ошибок.

## v5.1.1

- [x] Исправлена ошибка в методе `returnMainTpl`.

## v5.1.0

- [x] Добавлен новый флаг трансляции `tolerateWhitespace`;
- [x] Добавлен псевдокласс `:inline` для директивы `tag`;
- [x] Переработан механизм обработки пробельных символов.

## v5.0.0

- [x] Удалена директива `ignore`, а функциональность вынесена в настройки трансляции;
- [x] Добавлена директива `setSSFlag` для управления настройками трансляции из шаблона;
- [x] Доработка системы модулей;
- [x] Добавлена поддержка внешних блоков;
- [x] Добавлен режим трансляции в императивный DOM;
- [x] Удалён флаг `stringBuffer`, добавлен флаг `renderMode` с параметрами: `stringConcat`, `stringBuffer`, `dom`;
- [x] Удалён флаг `interface`, добавлен флаг `renderAs` с параметрами: `placeholder`, `interface`, `template`; 
- [x] Доработка директивы include: добавлена поддержка модификаторов `as interface` и `as placeholder`;
- [x] Добавлена поддержка функций в качестве замены строк-локализации;
- [x] Добавлена директива `cdn`;
- [x] Добавлена поддержка `arguments` для прототипов;
- [X] Доработано CLI API: 
* добавлена поддержка работы с папками;
* добавлен флаг `--watch` для автоматической перекомпиляции шаблонов. 