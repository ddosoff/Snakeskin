iterators_index1
iterators_index2
iterators_index3
iterators_index4
iterators_index5
iterators_index6

###

{template iterators_index1()}
	{forEach [1, 2, 3] => el, i, obj, isFirst, isLast, length}
		{el} {i} {obj[i]} {isFirst} {isLast} {length} --
	{/}
{/}

{template iterators_index2()}
	{forEach {a: 1, b: 2} => el, key, obj, i, isFirst, isLast, length}
		{el} {key} {obj[key]} {i} {isFirst} {isLast} {length} --
	{/}
{/}

{template iterators_index3()}
	{a = Object.create({a: 1})}
	{forIn a => el, key, obj, i, isFirst, isLast, length}
		{el} {key} {obj[key]} {i} {isFirst} {isLast} {length} --
	{/}
{/}

{template iterators_index4()}
	{forEach [1, 2, 3] => el, i, obj, isFirst, isLast, length}
		{el}
		{continue}
		{i} {obj[i]} {isFirst} {isLast} {length} --
	{/}
{/}

{template iterators_index5()}
	{forEach {a: 1, b: 2} => el, key, obj, i, isFirst, isLast, length}
		{el} {key} {obj[key]} {i} {isFirst} {isLast} {length} --
		{break}
	{/}
{/}

{template iterators_index6()}
	{a = Object.create({a: 1})}
	{forIn a => el, key, obj, i, isFirst, isLast, length}
		{break}
		{el} {key} {obj[key]} {i} {isFirst} {isLast} {length} --
	{/}
{/}

###

1 0 1 true false 3 — 2 1 2 false false 3 — 3 2 3 false true 3 —

***

1 a 1 0 true false 2 — 2 b 2 1 false true 2 —

***

1 a 1 0 true true 1 —

***

1 2 3

***

1 a 1 0 true false 2 —

***