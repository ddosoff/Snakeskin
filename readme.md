# Snakeskin

Snakeskin — компилятор блочных шаблонов c поддержкой наследования.
Независим от среды исполнения, для работы нужен лишь интерпретатор JavaScript.

Подробная статья с описанием: http://habrahabr.ru/post/168093/

Поиграться можно тут: http://jsfiddle.net/NAPWB

## Общая концепция

Шаблоны в Snakeskin — это функции в JavaScript.

    {template foo()}
        Hello World!
    {end}

Эквивалентно

    function foo() {
        return 'Hello World';
    }

После компиляции вызов шаблона соотвествует простому вызову функции `foo()`.
Такой же подход используется в Google Closure Templates.

### Варианты применения

Существует 2 сценария использования Snakeskin:

* Предварительная трансляция файлов Snakeskin в файлы JavaScript и подключение последних;
* "Живая" компиляция шаблонов.

#### Пример использования Snakeskin с компиляцией в браузере

    <!doctype html>
    <html>
        <head>
            <title>Пример</title>
            <meta charset="utf-8">
            <script src="snakeskin.js"></script>
        </head>

        <body>
            <script type="text/x-snakeskin-template" id="templates">
                {template hello(name)}
                    Hello {name}!
                {end}

                {template calc(a, b)}
                    {a + b}
                {end}
            </script>

            <div id="result1"></div>
            <div id="result2"></div>

            <script>
                // Компиляция шаблонов,
                // после шаблоны hello и calc станут доступны,
                // как простые глобальные функции
                Snakeskin.compile(document.getElementById('templates'));

                // Выведем результат работы шаблонов
                document.getElementById('result1').innerHTML = hello('World');
                document.getElementById('result2').innerHTML = calc(5, 7);
            </script>
        </body>
    </html>

## Области декларации шаблонов

Шаблоны можно описывать в отдельных файлах с расширением `.ss`
или же в блоках `<script type="text/x-snakeskin-template">...</script>`.
В одной области может быть объявлено неограниченное количество шаблонов.

## Синтаксис управляющих конструкций

Управляющие конструкции шаблонизатора размещаются между `{` и `}`.

## Комментарии

В любом месте области декларации шаблонов допускается использовать однострочные (`///`) и многострочные (`/* ... */`)
комментарии.

    /* ... */
    /// ...
    {template foo(name)}
        ///{name}
        /*Hello
        World*/

        {1 /*+ 2*/} /// выведет 1

        /* Чтобы отменить нежелательный комментарий, то его можно экранировать */
        file://\/... /// экранируем последний /, чтобы URL вывелся как надо
    {end}

Вне декларации шаблона можно также использовать специальные jsDoc комментарии,
которые не будут вырезаться на этапе трансляции
(это может быть нужно, если, например, после трансляции шаблоны будут компилироваться в Google Closure Compiler).

    /**
     * Описание шаблона
     *
     * @param {?} param1 - параметр 1
     * @param {?} param2 - параметр 2
     * @return {string}
     */
    {template myTemplate(param1, param2)}
    {end}

## Объявления шаблона

Простой шаблон без входных параметров:

    {template myTemplate()}
        Тело шаблона
    {end}

Простой шаблон без входных параметров объявленный в пространстве имён (безопасность добавления проверяется):

    {template myTpl.myTemplate()}
        Тело шаблона
    {end}

    {template myTpl['myTemplate']()}
        Тело шаблона
    {end}

Есть одно небольшое отличие в конечном коде, при использовании `myTpl.myTemplate()` и `myTpl['myTemplate']()`:
в первом случае будет `myTpl.myTemplate = function myTemplate() {`, а во втором `myTpl['myTemplate'] = function () {`,
т.е. первая скомпилированная функция именованная, а вторая нет.

Шаблон с 2-мя входными параметрами, причём один из них имеет значение по умолчанию:

    {template myTemplate(a = 1, b)}
        Тело шаблона
    {end}

Шаблон, который наследует функционал другого шаблона:

    {template nextTemplate(a, b) extends myTemplate}
        Тело шаблона
    {end}

## Шаблоны placeholder

Директива placeholder позволяет декларироват шаблоны, которые будут существовать только на этапе трансляции,
но не войдут в скомпилированный файл. Синтаксис placeholder идентичен синтаксису template.

    {placeholder myTpl.myTemplate()}
        Тело шаблона
    {end}

    {placeholder myTpl['myTemplate']()}
        Тело шаблона
    {end}

## Константы внутри шаблона

В любом месте внутри шаблона можно объявить константу.
После определение константы будет невозможным переопределить её значение
или создать новую с таким же именем. Константы имеют глобальную область видимости внутри шаблона,
т.е. не важно где она будет определена.
Константа может принимать любое валидное JavaScript значение (кроме деларации функции).
Входные параметры шаблона также являются константами.

    {a = 1}
    {b = [{a: 1}, 2, 3]}
    {c = someFunction()}
    {r = a === 1 ? 2 : 4}

Несмотря на то, что значение константы нельзя переопределить, его можно модифицировать, т.е.:

    {a = 1}
    {a += 2}
    {a--}

    {b = {}}
    {b.val = 1} /// свойство b.val также является константой

    {b = 3} /// error, нельзя переопределить константу

Ключевое слово const обычно опускается, но его можно писать явно.

    {const a = 1}

## Переменные внутри шаблона

В любом месте шаблона могут быть объявлены переменные.
В отличии от констант их значение может быть переопределено в ходе выполнения шаблона.
Переменные не могут быть переопределены явно в дочернем шаблоне (константы могут).

    {var a = 1}
    {var b = [{a: 1}, 2, 3]}

    /// Несколько переменных в одной директиве
    {var c = someFunction(),
        r = a === 1 ? 2 : 4}

    /// Более короткий синтаксис объявления
    {:e = 1, j = 2}

Переменные имеют блочную область видимости (аналогия с let в JavaScript).

    {template foo()}
        {if 1}
            {:a = 1}
            {a} /// 1
        {end}

        {a} /// error, a is not defined

        {:b = 1}
        {if 1}
            {b} /// 1
        {end}

        {b} /// 1
    {end}

## Супер-глобальные переменные

Вне тела шаблона можно декларировать супер-глобальные переменные.
Доступ к этим переменным может получить любой шаблон.

    {a = 1}
    {template foo()}
        /// Для доступа к супер-глобальной переменной испольюзуется модификатор @
        {@a}

        /// Внутри шаблона можно определять новые или изменять значение старых переменных
        {@a += 2}
        {@c = 1}
    {end}

Значение переменных сохраняется в `Snakeskin.Vars`.

## Вывод значений

Для вывода значений в шаблон используется следующий синтаксис `{a}`.
Внутри выводимой конструкции можно использовать любой валидный JavaScript.

    {a > 1 ? 'foo' : 'bar'}
    {1 + 2}
    {Math.round(Math.random())}
    {new Date() + 1e3}
    {'foo'.length + @a['myValue']}

### Фильтры

Snakeskin поддерживает механизм фильтров — это более удобный и "сахарный" доступ к функциям
в пространстве имён Snakeskin.Filters.

    {a|ucfirst} /// {Snakeskin.Filters['ucfirst'](a)}
    {a + b|ucfirst} /// {Snakeskin.Filters['ucfirst'](a + b)}

Допускается использовать последовательности фильтров

    {a + b|trim|ucfirst} /// {Snakeskin.Filters['ucfirst'](Snakeskin.Filters['trim'](a + b))}

Фильтры можно накладывать отдельно на некоторые части выражения, для этого нужно обернуть декларацию в круглые скобки.

    /// Два локальных и один глобальный фильтр
    {(a|ucfirst) + (b|ucfirst) |trim}

Фильтрам можно передавать параметры, на которые также можно применять фильтры и т.д.

    {a|myFilter 1, (2 / 3|myFilter)}

По умолчанию при выводе значений через `{ ... }` к ним применяется глобальный фильтр html (экранирование html символов),
однако его выполнение можно отменить `{a|!html}`.

Механизм фильтров поддерживает большинство директив Snakeskin.

    {var a = ('fooo '|trim)}

    {if a|trim}
        ...
    {end}

Чтобы написать свой фильтр, достаточно добавить его в `Snakeskin.Filters`.
Название фильтра может начинаться с символа латинского алфавита, подчёркивания (_) и знака доллара ($).
Первым параметром функции будет значение выражения.

    // Составить строку из повторений подстроки, где opt_num число повторений
    Snakeskin.Filters['repeat'] = function (str, opt_num) {
        return new Array(opt_num || 2).join(str);
    };

В библиотеку Snakeskin входит несколько стандартных фильтров:

* html – экранирование html сущностей, применяется по умолчанию на все выводимые через `{ ... }` параметры;
* !html – отменяет выполнение по умолчанию фильтра html;
* uhtml – обратная операция html (& => & и т.д.);
* stripTags – удаляет знаки тегов (< и >);
* uri – кодирует URL;
* json – JSON.stringify (для поддержки в старых браузеров необходимо будет подключить полифил, например, JSON2.js);
* upper – переводит строку в верхний регистр;
* ucfirst – переводит первую букву строки в верхний регистр;
* lower – переводит строку в нижний регистр;
* lcfirst – переводит первую букву строки в нижний регистр;
* trim – срезает крайние пробелы у строки;
* collapse – сворачивает пробелы в 1 и срезает крайние у строки;
* truncate – обрезает строку до указанный длины и в конце подставляет троеточие, имеет 1 обязательный параметр (максимальная длина) и 1 необязательный (true, если обрезается с учётом целостности слов);
* repeat – создаёт строку из повторений входной строки, имеет 1 необязательный параметр (количество повторений, по умолчанию 2);
* remove – удаляет указанную подстроку из входной строки, подстрока указывается как строка или как регулярное выражение;
* replace – заменяет указанную подстроку из входной строки, подстрока указывается как строка или как регулярное выражение, строка замены указывается как простая строка.

#### Примечание к фильтрам

Чтобы использовать в шаблоне побитовое ИЛИ (|) достаточно просто указать пробел после оператора |,
также если после оператора | идёт число, то можно писать как есть, т.к. название фильтра не может начинаться с числа.

    {1|0}

    {a = 1}
    {1 | a}

## Условия

    {if a === 1}
        ...
    {elseIf a == 3}
        ...
    {else}
        ...
    {end}

    {if (b == 4 || c == 4) && a == 4}
        {if g == 4}
           ...
        {end}
    {end}

    {switch a}
        {case 1}
            ...
        {end}

        {case 2}
            ...
        {end}

        /// Для case есть более короткий синтаксиc
        {> 3}
            ...
        {end}

        {default}
            ...
        {end}
    {end}

## Итераторы

Для итерации по массивам и объектам используется директива `forEach`,
локальные переменные цикла могут объявляться после `=>` через запятую (опционально).

Для массивов список входны параметров следующий:
* значение элемента;
* номер итерации;
* ссылка на итерируемый массив;
* является ли элемент первым;
* является ли элемент последним;
* длина массива.

Для объектов:
* значение элемента;
* ключ;
* ссылка на итерируемый объект;
* номер итерации;
* является ли элемент первым;
* является ли элемент последним;
* длина объекта.

Пример:

    {forEach a => el, i}
        {forEach el}
        {end}
    {end}

Для итерации по объектам без учёта `hasOwnProperty` существует директива `forIn`
(список аргументов такой же, как и у `forEach` для объектов).

    {forIn a => el}
        {el}
    {end}

Внутри итераторов можно использовать директивы `break` и `continue`.

    {forEach a => el, i}
        {if i > 2}
            {break}
        {end}
    {end}

## Циклы

    {for var i = 0; i < 10; i++}
        ...
    {end}

    {var i = 10}
    {while i--}
        ...
    {end}

    {var i = 10}
    {do}
        ...
    {while i--}

    /// repeat-until является псевдонимом do-while
    {var i = 10}
    {repeat}
        ...
    {until i--}

Внутри циклов можно использовать директивы `break` и `continue`.

## Директива with

Директива задаёт область видимости для поиска свойств объекта.

    {with a.child}
        {a} /// a.child.a
        {with a.next}
            {a + b} /// a.child.a.next.a + a.child.a.next.b
        {end}
    {end}

Внутри директивы with поддерживаются модификаторы контекста:
* # - искать значение на один with блок выше, например, `{#a}`
* #n (где n - целое число от 1) - искать значение на n with блок выше, например, `{#2a}`
* @ - искать значение вне with блоков, например, `{@a}`
* @@ - искать значение супер-глобальной переменной, например, `{@@a}`

    {with a.child}
        {#a} /// a
        {with a.next}
            {#a + @b + @@c} /// a.child.a + b + Snakeskin.Vars['c']
        {end}
    {end}

При объявлении переменных внутри блоков with доступ адресуется к ним

    {with foo}
        {var a = 1}
        {a + b} /// 1 + foo.b
    {end}

## Директивы proto и apply

Директива proto позволяет декларировать блоки, которые можно будет применять в шаблоне с помощью директивы `apply`.

    {proto a}
        foo
    {end}

    {apply a}
    {apply a}

При декларации proto внутри `with` полученный блок наследует родительский контекст.

    {with foo}
        {proto a}
            {name}
        {end}
    {end}

    {apply a} /// {foo.name}

Директива может иметь входные параметры

    {proto foo(a, b = 1)}
        {a + b}
    {end}

    {apply foo(1, 2)} /// 3
    {apply foo(1)} /// 2

Допускается рекурсивный вызов директивы

    {proto foo(i)}
        {i}
        {if i}
            {apply --i}
        {end}
    {end}

    {apply foo(3)} /// 3 2 1 0

## Директива call

Директива используется для вызова других шаблонов в теле шаблона.

    {call myTpl()}

## Директива void

Директива выполняет указанное действие, но ничего не выводит в шаблон.

    {void changeDocTitle('Foobar')}

Также для директивы доступна более короткая форма записи:

    {?changeDocTitle('Foobar')}

## Директива end

Директива завершает тело другой директивы, поддерживает несколько форм записей.

    {template}
        ...
    {end} /// Такая форма не доступна для cdata

    {template}
        ...
    {end template}

    {template}
        ...
    {/template}

## Директива cut

Директива декларирует удаления шаблона из скомпилированного кода, например,
это нужно когда шаблон используется при наследовании, но самостоятельно нигде не вызывается.

    {cut myTpl}

## Директива save

Директива отменяет действие директивы cut.

    {save myTpl}

## Директива data

Директива для более удобной декларации JS подобных структур.
Для передачи констант и переменных используется синтаксис ${}.

    {template my()}
        {a = 1}
        <button data-bind="{data {count: ${a}, name: 'test'}}">Нажми меня!</button>
    {end}

Также для директивы доступна более короткая форма записи:

    {template my()}
        {a = 1}
        <button data-bind="{{count: ${a}, name: 'test'}}">Нажми меня!</button>
    {end}

## Директива cdata

Выделенная последовательность вырезается при обработке парсером,
а затем вставляется без изменений в результирующую функцию.

    /// Блоки внутри cdata не будут обработаны парсером
    {cdata}
        {if a = 1}
        {end}
    {end cdata}

    {cdata}
       {if a = 1}
       {end}
    {/cdata}

## Наследования шаблонов

Наследование реализовано с помощью директив block, proto и переопределении констант.
Уровень вложенности наследования не ограничен. Входные параметры шаблона наследуются в случае,
если их указать при декларации (если этого не сделать, то они просто станут локальными константами),
значение по умолчанию также наследуется.

    {template base(a = 2)}
        {e = 1}
        {proto exec}
            foo
        {end}

        <!doctype html>
        <html>
            <head>
                {block head}
                    <title>
                        {block title}
                            {apply exec}
                        {end}
                    </title>
                {end}
            </head>

            {block footer}
            {end}
        </html>
    {end}

    /// Переопределим значение по умолчанию у константы a
    {template child(a = 3, l = 'my') extends base}
         /// Переопределим константу e
         {e = 4}
         /// Добавим новую константу j
         /// (добавится после всех наследуемых констант)
         {j = 4}

         /// Переопределим блок title
         {block title}
            Заголовок
         {end}

         /// Новые блоки добавляются в конец
         /// (кроме новых вложенных блоков)
         {block end}
         {end}
    {end}

## Дополнительно

Символы табуляции и новой строки автоматически вырезаются парсером (кроме блоков cdata).

Внутри шаблона доступны заранее определённые переменные: `TPL_NAME` и `PARENT_TPL_NAME`.

Если при декларации имени шаблона, последняя часть стоит без квадратных скобок,
то в JS у функции будет задано свойство name.

    {template foo} /// function foo
    {template my.foo} /// var my.foo = function foo
    {template my['foo']} /// var my['foo'] = function

Если вы транслируете шаблоны с помощью консольного приложения snakeskin, то в файлах шаблонов вы можете использовать
директивы [jossy](https://github.com/Kolyaj/Jossy) для сборки множества файлов.

## Установка

    npm install -g snakeskin

или

    git clone https://github.com/kobezzza/Snakeskin

## Как компилировать и что подключать

Для компиляции файла шаблонов, нужно просто запустить snakeskin: `snakeskin -s myTemplates.ss`.
Скомпилированный файл сохранится в папке с myTemplates.ss, как myTemplates.ss.js, однако можно вручную указать имя:
`snakeskin myTemplates.ss -o ../result.js`.

Флаг -cjs указывает, что скомпилированные функции должны быть декларированы, как свойства exports
`snakeskin -cjs myTemplates.ss ../result.js`.

Для работы скомпилированного шаблона, необходимо также подключить snakeskin.live.js (или snakeskin.live.min.js).
При подключении шаблонов через require (на сервере) можно воспользоваться методом liveInit, для подгрузки snakeskin.live.

    var tpl = require('./helloworld.commonjs.ss.js').liveInit('../snakeskin.live.min.js');

Или же можно просто объявить глобальную переменную Snakeskin.

    global.Snakeskin = require('../snakeskin.live.min.js');

Для live в компиляции в браузере необходимо подключать snakeskin.js (или snakeskin.min.js) и пользоваться методом
compile, который принимает ссылку на DOM узел или текст шаблонов.

Скомпилированные шаблоны вызываются как простые JavaScript функции и принимают указанные в шаблоне параметры.
