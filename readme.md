# Snakeskin

Snakeskin — компилятор блочных шаблонов c поддержкой наследования.
Независим от среды исполнения, для работы нужен лишь интерпретатор JavaScript.

Подробная статья с описанием: http://habrahabr.ru/post/168093/

Поиграться можно тут: http://jsfiddle.net/kobezzza/NAPWB/

## Области декларации шаблонов

Шаблоны можно описывать в файлах с расширением `.ss`
или же в блоках `<script type="text/x-snakeskin-template">...</script>`
(если нужна live компиляция шаблона, например, для отладки).
В одной области может быть объявлено неограниченное количество шаблонов.

## Синтаксис управляющих конструкций

Управляющие конструкции шаблонизатора размещаются между `{` и `}`.

## Комментарии

В любом месте области декларации шаблонов допускается использовать однострочные (`///`) и многострочные (`/* ... */`)
комментарии.

## Объявления шаблона

Простой шаблон без входных параметров:

    {template myTemplate()}
        Тело шаблона
    {end}

Простой шаблон без входных параметров объявленный в пространстве имён:

    {template myTpl.myTemplate()}
        Тело шаблона
    {end}

    {template myTpl['myTemplate']()}
        Тело шаблона
    {end}

Шаблон с 2-мя входными параметрами, причём один из них имеет значение по умолчанию:

    {template myTemplate(a = 1, b)}
        Тело шаблона
    {end}

Шаблон, который наследует функционал другого шаблона:

    {template nextTemplate(a, b) extends myTemplate}
        Тело шаблона
    {end}

## Константы внутри шаблона

В любом месте внутри шаблона, кроме тела цикла, можно объявить константы.
После определение константы будет невозможным поменять её значение
или создать новую с таким же именем. Константа может принимать любое валидное JavaScript значение (кроме деларации функции).
Входные параметры шаблона также являются константами.

    {a = 1}
    {b = [{a: 1}, 2, 3]}
    {c = someFunction()}
    {r = a === 1 ? 2 : 4}

## Переменные внутри шаблона

В любом месте шаблона могут быть объявлены переменные.
В отличии от констант их значение может быть переопределено в ходе выполнения шаблона.
Переменные не могут быть переопределены явно в дочернем шаблоне (константы могут).

    {var a = 1}
    {var b = [{a: 1}, 2, 3]}
    {var c = someFunction()}
    {var r = a === 1 ? 2 : 4}

## Супер-глобальные переменные

Вне тела шаблона можно декларировать супер-глобальные переменные. Доступ к этим переменным может получить любой шаблон.

    {a = 1}
    {template foo()}
        /// Для доступа к супер-глобальной переменной испольюзуется модификатор @
        {@a}

        /// Внутри шаблона можно определять новые или изменять значение старых переменных
        {@a = 2}
        {@c = 1}
    {end}

Значение переменных сохраняется в `Snakeskin.Vars`.

## Вывод значений

Для вывода значений в шаблон используется следующий синтаксис `{a}`.
На выводимое значение можно накладывать фильтры.

    /// Пример применения фильтров,
    /// dateFormat вызывается после pretyUrl и принимает 2 входных параметра
    {a|pretyUrl|dateFormat 'd.m.y', 'utc'}

    // Выражение c фильтром
    {a > b ? a + f : 0 |round}

Фильтры можно накладывать отдельно на некоторые части выражения, для этого нужно обернуть декларацию в круглые скобки.

    /// Два локальных и один глобальный фильтр
    {(a|ucfirst) + (b|ucfirst) |trim}

Локальные фильтры можно использовать и в других директивах шаблона.

    {a = ('foo'|ucfirst)}
    {forEach (a|...)}

Директивы поддерживающие локальные фильтры: *var*, *forEach*, *for*, *while*, *until*, *if*, *elseIf*, *data*,
декларация констант и вывод значений.

Чтобы написать свой фильтр, достаточно добавить его в `Snakeskin.Filters`.
Название фильтра может начинаться с символа латинского алфавита, подчёркивания (_) и знака доллара ($).
Первым параметром функции будет значение выражения.

По умолчанию при выводе значений к ним применяется глобальный фильтр html (экранирование html символов),
однако его выполнение можно отменить `{a|!html}`.

Чтобы использовать в шаблоне побитовое ИЛИ (|) достаточно просто указать пробел после оператора |,
также если после оператора | идёт число, то можно писать как есть, т.к. название фильтра не может начинаться с числа.

    {1|0}

    {a = 1}
    {1 | a}

При выводе значений можно использовать модификатор контекста @, который указывает, что значение нужно искать в списке
супер-глобальных переменных.

    {@a} /// Snakeskin.Vars['a']

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

## Итератор

Для итерации по массивам и объектам используется директива `forEach`,
локальные константы цикла могут объявляться после `=>` через запятую (опционально).

Для массивов список входны параметров следующий:
* значение элемента;
* номер итерации;
* является ли элемент первым;
* является ли элемент последним;
* длина массива.

Для объектов:
* значение элемента;
* ключ;
* номер;
* итерации;
* является ли элемент первым;
* является ли элемент последним;
* длина объекта.

Пример:

    {forEach a => el, i}
        {forEach el}
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
    {repeat}
        ...
    {until i--}

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

Директивы поддерживающие работы с with: *with*, *var*, *forEach*, *for*, *while*, *until*, *if*, *elseIf*, *data*,
декларация констант и вывод значений.

## Директивы proto и apply

Директива proto позволяет декларировать блоки, которые можно будет применять в шаблоне с помощью директивы `apply`.

    {proto a}
        foo
    {end}

    {apply a}
    {apply a}

При декларации proto внутри with полученный блок наследует родительский контекст.

    {with foo}
        {proto a}
            {name}
        {end}
    {end}

    {apply a} /// {foo.name}

## Директива console

Это просто возжность использовать console api отладчика.

    {console.log(a)}

## Директива call

Директива используется для вызова других шаблонов в теле шаблона.

    {call myTpl()}

## Директива void

Директива выполняет указанное действие, но ничего не выводит в шаблон.

    {void changeDocTitle('Foobar')}

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
        <button data-bind="{{ {count: ${a}, name: 'test'} }}">Нажми меня!</button>
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
