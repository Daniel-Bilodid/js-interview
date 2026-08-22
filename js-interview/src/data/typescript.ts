import type { Topic } from '../types'

/*
 * ЯК ДОДАТИ НОВЕ ПИТАННЯ 👇
 * Скопіюйте блок нижче в кінець масиву (перед закривною дужкою ]):
 *
 * {
 *   id: 'unikalnyi-id',            // латиницею, через дефіс
 *   title: 'Питання, як його ставлять на співбесіді',
 *   description:
 *     'Пояснення простими словами. Пишіть кількома реченнями — сайт сам розібʼє їх на абзаци. Назви функцій і код у тексті підсвітяться автоматично.',
 *   codeExamples: [
 *     {
 *       label: 'Що показує приклад',
 *       code: `const x = 1; // сам код`,
 *     },
 *   ],
 *   gotchas: [
 *     'Підводний камінь або каверзне запитання №1.',
 *     'Підводний камінь №2.',
 *   ],
 * },
 */

export const typescriptTopics: Topic[] = [
  {
    id: 'ts-enums',
    title: 'Enum у TypeScript — що це і коли використовувати',
    description:
      'Enum (перелік) — це спосіб дати імена набору повʼязаних констант. Бувають числові (за замовчуванням значення 0, 1, 2…), рядкові (кожному явно присвоюється рядок) і const enum (вбудовується в код під час компіляції, без обʼєкта в рантаймі). Числові enum створюють «зворотний мапінг» (за значенням можна дістати імʼя), рядкові — ні. Enum — одна з небагатьох конструкцій TS, що генерує реальний JS-код (звичайний enum стає обʼєктом), на відміну від типів, які стираються. Часто замість enum рекомендують union рядкових літералів ("a" | "b") або обʼєкт as const — вони легші й безпечніші.',
    codeExamples: [
      {
        label: 'Числовий, рядковий, const',
        code: `enum Direction { Up, Down, Left, Right } // 0,1,2,3
Direction.Up;        // 0
Direction[0];        // "Up" — зворотний мапінг

enum Status { Active = "ACTIVE", Banned = "BANNED" }
Status.Active;       // "ACTIVE"

const enum Size { S, M, L } // вбудовується, без обʼєкта в рантаймі
let s = Size.M;             // компілюється в: let s = 1;`,
      },
      {
        label: 'Альтернатива — union літералів',
        code: `type Direction = "up" | "down" | "left" | "right";
function move(d: Direction) {}
move("up");   // ✅
// move("UP"); // ❌ помилка типу

// або обʼєкт as const
const Roles = { Admin: "admin", User: "user" } as const;
type Role = typeof Roles[keyof typeof Roles]; // "admin" | "user"`,
      },
    ],
    gotchas: [
      'Звичайний enum генерує код у рантаймі — типи зазвичай стираються, а enum ні.',
      'Числовий enum приймає будь-яке число (Direction = 99) — менш безпечний за union літералів.',
      'const enum не працює з isolatedModules / Babel — у бібліотеках це ризик.',
      'Зворотний мапінг є лише в числових enum, у рядкових — ні.',
      'Після члена з рядковим значенням авто-нумерація ламається — наступні члени мусять мати явні значення (Peach, Apricot = "apricot", Cherry ← помилка).',
      'Вставка нового члена посередині числового enum зсуває всі наступні значення.',
    ],
  },
  {
    id: 'ts-interface-vs-type',
    title: 'Різниця між interface і type',
    description:
      'Обидва описують форму даних, і в більшості випадків взаємозамінні. interface — призначений насамперед для опису обʼєктів і класів; його можна розширювати через extends і він підтримує «злиття декларацій» (declaration merging): кілька інтерфейсів з однаковим імʼям обʼєднуються в один. type (type alias) — псевдонім для будь-якого типу: не лише обʼєкта, а й union, intersection, кортежу, примітива, функції, mapped і conditional типів. type не зливається — повторне оголошення дає помилку. Розширення в type робиться через перетин (&). interface дає трохи кращі повідомлення про помилки й продуктивність компілятора для великих обʼєктів. Поширена рекомендація: interface для публічних обʼєктів/API, type — для union, функцій і складних обчислюваних типів.',
    codeExamples: [
      {
        label: 'interface: extends і merging',
        code: `interface Animal { name: string }
interface Dog extends Animal { bark(): void } // розширення

interface Window { myGlobal: string } // зливається з наявним Window
interface Window { another: number }   // обидва поля доступні`,
      },
      {
        label: 'type: union, функції, перетин',
        code: `type ID = number | string;            // union — interface так не вміє
type Handler = (e: Event) => void;    // функція
type Point = { x: number };
type Point3D = Point & { z: number }; // розширення через перетин`,
      },
    ],
    gotchas: [
      'Тільки interface підтримує declaration merging — для type повторне оголошення це помилка.',
      'union, кортежі й примітиви можна описати лише через type, не через interface.',
      'Випадкове злиття однойменних інтерфейсів може непомітно додати поля.',
      'extends в interface і & в type не зовсім ідентичні: перетин може дати never при конфлікті полів.',
      'Для великих обʼєктів interface зазвичай дає кращі повідомлення про помилки.',
    ],
  },
  {
    id: 'ts-generics',
    title: 'Generics (дженерики) — що це і які переваги',
    description:
      'Generics — це «параметри типу»: вони дозволяють писати функції, класи й типи, що працюють із будь-яким типом, але зберігають звʼязок між вхідним і вихідним типом. Замість any, який втрачає інформацію, дженерик її проносить: function identity<T>(x: T): T повертає рівно той тип, що отримав. Параметр типу (зазвичай T, K, V) виводиться автоматично з аргументів або задається явно. Дженерики можна обмежувати через extends (T extends { id: number }) — щоб гарантувати наявність потрібних властивостей. Вони — основа типобезпечних колекцій (Array<T>, Map<K,V>), утиліт (Promise<T>) і повторно використовуваного коду без втрати типізації.',
    codeExamples: [
      {
        label: 'Базовий дженерик і обмеження',
        code: `function identity<T>(value: T): T { return value; }
identity<string>("hi"); // T = string
identity(42);            // T виведено як number

// обмеження через extends
function getId<T extends { id: number }>(item: T) {
  return item.id; // гарантовано є поле id
}`,
      },
      {
        label: 'Дженерик-клас і кілька параметрів',
        code: `class Box<T> {
  constructor(public value: T) {}
}
const b = new Box<number>(5); // Box<number>

function pair<K, V>(k: K, v: V): [K, V] { return [k, v]; }
pair("age", 30); // [string, number]`,
      },
    ],
    gotchas: [
      'Дженерики стираються при компіляції — у рантаймі типу T немає (не можна new T()).',
      'Без обмеження (extends) над T майже нічого не можна зробити — TS не знає його форми.',
      'Надмірно складні дженерики дають нечитабельні помилки — не зловживайте.',
      'Дефолт параметра типу (T = unknown) корисний, але приховує пропущене виведення.',
      'any як аргумент дженерика «протікає» і знищує користь від типізації.',
    ],
  },
  {
    id: 'ts-namespaces',
    title: 'Namespaces — як створювати й використовувати',
    description:
      'Namespace — це спосіб згрупувати повʼязаний код (типи, функції, змінні) під одним іменем, щоб уникнути забруднення глобальної області. Оголошується через namespace Name { ... }, а назовні видно лише те, що позначено export. Це давній механізм TS (раніше називався «internal modules»), що зʼявився ще ДО ES-модулів. Сьогодні для організації коду рекомендують саме ES-модулі (import/export по файлах), а не namespaces. Namespaces досі доречні в одному кейсі: у файлах декларацій (.d.ts) для опису типів глобальних бібліотек, підключених через <script>, та для declaration merging із наявними глобальними обʼєктами.',
    codeExamples: [
      {
        label: 'Оголошення й використання',
        code: `namespace Geometry {
  export interface Point { x: number; y: number }
  export function dist(a: Point, b: Point) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  const TWO_PI = Math.PI * 2; // не export — приватне
}
const p: Geometry.Point = { x: 0, y: 0 };
Geometry.dist(p, { x: 3, y: 4 }); // 5`,
      },
      {
        label: 'Сучасна альтернатива — ES-модулі',
        code: `// geometry.ts
export interface Point { x: number; y: number }
export function dist(a: Point, b: Point) { /* ... */ }

// інший файл
import { Point, dist } from "./geometry";`,
      },
    ],
    gotchas: [
      'Для організації коду namespaces застарілі — використовуйте ES-модулі.',
      'Без export член namespace недоступний ззовні.',
      'Поєднання namespaces з модулями в одному проєкті заплутує структуру.',
      'Колишня назва «internal modules» плутає з реальними модулями.',
      'Доречні переважно у .d.ts для глобальних типів і declaration merging.',
      'Стара механіка підключення namespace з іншого файлу — triple-slash директива /// <reference path="..." />; у сучасному коді її замінив import.',
    ],
  },
  {
    id: 'ts-decorators',
    title: 'Decorators (декоратори) — що це і кейси',
    description:
      'Декоратор — це функція, яку приставляють до класу, методу, властивості, аксесора чи параметра через синтаксис @decorator, щоб додати або змінити їхню поведінку без правки самого коду. Це форма метапрограмування. Декоратор отримує інформацію про ціль і може її обгорнути, замінити чи зареєструвати десь. Класичні кейси: логування, кешування/мемоізація методів, вимірювання часу, валідація, інʼєкція залежностей, реєстрація роутів. Декоратори широко використовуються в Angular, NestJS, TypeORM, class-validator. Важливо: були довго експериментальними (legacy, потребували experimentalDecorators), а тепер є нова стандартна реалізація (TC39 Stage 3) із дещо іншим API — версії несумісні між собою.',
    codeExamples: [
      {
        label: 'Декоратор методу (логування)',
        code: `function log(_t: any, key: string, desc: PropertyDescriptor) {
  const original = desc.value;
  desc.value = function (...args: any[]) {
    console.log("call", key, args);
    return original.apply(this, args);
  };
}
class Api {
  @log
  fetchUser(id: number) { return { id }; }
}`,
      },
      {
        label: 'Декоратори у фреймворках',
        code: `// NestJS / Angular стиль
@Controller("users")
class UsersController {
  @Get(":id")
  findOne(@Param("id") id: string) { /* ... */ }
}`,
      },
    ],
    gotchas: [
      'Дві несумісні системи: legacy (experimentalDecorators) і новий стандарт TC39 — різне API.',
      'Декоратор виконується ОДИН раз — у момент оголошення класу, а не при кожному new.',
      'Декоратори параметрів і метадані часто потребують reflect-metadata.',
      'Порядок застосування: знизу вгору для кількох декораторів на одній цілі.',
      'Приховують логіку «за магією» — ускладнюють дебаг поза знайомими фреймворками.',
      'Поведінка залежить від налаштувань tsconfig — легко отримати несподіванку при міграції.',
    ],
  },
  {
    id: 'ts-any-vs-unknown',
    title: 'Різниця між any і unknown',
    description:
      'Обидва приймають будь-яке значення, але поводяться протилежно щодо безпеки. any повністю вимикає перевірку типів: зі значенням any можна робити будь-що (викликати, звертатися до полів, присвоювати куди завгодно) — і помилки не буде під час компіляції, але вона вилізе в рантаймі. unknown — це «безпечний any»: значення прийняти можна, але НІЧОГО з ним зробити не можна, доки ви не звузите тип (через перевірку typeof, instanceof, або type guard). Тобто unknown змушує спочатку довести, що це за тип, а потім використовувати. unknown — рекомендований тип для значень із непевним джерелом: відповідь API, JSON.parse, catch у try/catch.',
    codeExamples: [
      {
        label: 'any не перевіряється, unknown — захищає',
        code: `let a: any = "hi";
a.foo.bar();      // ✅ компілюється, але впаде в рантаймі

let u: unknown = "hi";
// u.toUpperCase(); // ❌ помилка: спершу звузь тип
if (typeof u === "string") {
  u.toUpperCase(); // ✅ тепер TS знає, що це string
}`,
      },
      {
        label: 'unknown для зовнішніх даних',
        code: `async function load(): Promise<unknown> {
  const res = await fetch("/api");
  return res.json(); // невідома форма
}
try { /* ... */ } catch (e: unknown) {
  if (e instanceof Error) console.log(e.message);
}`,
      },
    ],
    gotchas: [
      'any «протікає»: одне значення знищує типобезпеку всього, що з ним взаємодіє.',
      'unknown не можна використати без звуження — це фіча, а не незручність.',
      'any можна присвоїти будь-куди; unknown — лише в unknown або any.',
      'У catch (e) помилка історично any — увімкніть useUnknownInCatchVariables.',
      'JSON.parse повертає any — варто одразу типізувати результат як unknown і провалідувати.',
    ],
  },
  {
    id: 'ts-mapped-types',
    title: 'Mapped types — що це і як використовувати',
    description:
      'Mapped type — це тип, що «проходить» по ключах іншого типу й трансформує кожен з них, за аналогією до того, як map проходить масив. Синтаксис: { [K in keyof T]: ... }. Так побудовані вбудовані утиліти: Partial<T> додає ? до кожного поля, Readonly<T> додає readonly, Required<T> прибирає ?. Модифікатори можна додавати (readonly, ?) і прибирати (-readonly, -?). За допомогою as можна перейменовувати ключі (key remapping), а через [K in keyof T] звертатися до типу значення як T[K]. Mapped types — основа для написання власних узагальнених перетворень типів без дублювання.',
    codeExamples: [
      {
        label: 'Власні mapped-типи',
        code: `type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // прибрати readonly

interface User { id: number; name: string }
type PartialUser = MyPartial<User>; // { id?: number; name?: string }`,
      },
      {
        label: 'Key remapping і трансформація значень',
        code: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
};
type UserGetters = Getters<{ name: string }>;
// { getName: () => string }

type Nullable<T> = { [K in keyof T]: T[K] | null };`,
      },
    ],
    gotchas: [
      'homomorphic mapped-типи ({ [K in keyof T] }) зберігають модифікатори оригіналу, інші — ні.',
      'Перейменування ключів (as) доступне лише з TS 4.1+.',
      'Складні mapped+conditional типи дають заплутані помилки й тиснуть на компілятор.',
      '-readonly / -? прибирають модифікатори — легко забути синтаксис.',
      'keyof для типу з index signature дає union string|number — не завжди очікувано.',
    ],
  },
  {
    id: 'ts-index-signatures',
    title: 'Index signatures — як створювати й використовувати',
    description:
      'Index signature описує обʼєкт із заздалегідь невідомими ключами, але відомим типом значень: { [key: string]: number } означає «будь-який рядковий ключ дає число». Ключем може бути string, number або symbol. Це корисно для словників і динамічних мап, де поля не фіксовані. Альтернатива — утиліта Record<K, V>, що по суті робить те саме (Record<string, number> = { [k: string]: number }), часто читабельніше. Важлива пастка безпеки: за замовчуванням TS вважає, що звернення за будь-яким ключем поверне значення типу V, навіть якщо такого ключа немає — тому варто вмикати noUncheckedIndexedAccess, щоб результат ставав V | undefined і змушував перевіряти наявність.',
    codeExamples: [
      {
        label: 'Index signature і Record',
        code: `interface StringMap { [key: string]: number }
const scores: StringMap = { math: 90, eng: 85 };
scores.history = 70; // ✅ будь-який рядковий ключ

type ById = Record<number, string>; // те саме, читабельніше
const names: ById = { 1: "Ada", 2: "Bob" };`,
      },
      {
        label: 'Пастка без noUncheckedIndexedAccess',
        code: `const map: { [k: string]: number } = { a: 1 };
const v = map["missing"]; // тип number, але в рантаймі undefined!
// з noUncheckedIndexedAccess: тип стане number | undefined`,
      },
    ],
    gotchas: [
      'Без noUncheckedIndexedAccess доступ за відсутнім ключем має тип V, а в рантаймі undefined.',
      'Усі явні поля мусять бути сумісні з типом index signature.',
      'Числові ключі в JS усе одно стають рядками — [k: number] має нюанси.',
      'Index signature вимикає перевірку конкретних імен полів (втрата автокомпліту).',
      'Часто Record<K, V> читабельніший за ручну index signature.',
    ],
  },
  {
    id: 'ts-readonly-vs-const',
    title: 'Різниця між readonly і const',
    description:
      'Працюють на різних рівнях. const — це конструкція JavaScript рівня змінної: забороняє переприсвоювати саму змінну, але дозволяє мутувати вміст обʼєкта чи масиву (поля можна змінювати). readonly — це модифікатор TypeScript рівня властивості: позначене поле не можна змінювати після ініціалізації, але це перевірка лише під час компіляції (у рантаймі обмеження немає). Тобто const захищає звʼязування змінної, а readonly — конкретне поле. Є ще ReadonlyArray<T> (і readonly T[]) для незмінних масивів, і const-assertion (as const), що робить літерал глибоко незмінним типом і звужує до літеральних значень.',
    codeExamples: [
      {
        label: 'const vs readonly',
        code: `const user = { name: "Ada" };
user.name = "Bob"; // ✅ const дозволяє мутувати поле
// user = {};       // ❌ але не переприсвоїти змінну

interface Point { readonly x: number; y: number }
const p: Point = { x: 1, y: 2 };
p.y = 5;  // ✅
// p.x = 9; // ❌ readonly — помилка компіляції`,
      },
      {
        label: 'ReadonlyArray і as const',
        code: `const arr: readonly number[] = [1, 2, 3];
// arr.push(4); // ❌ немає мутуючих методів

const config = { mode: "dark" } as const;
// тип: { readonly mode: "dark" } — глибоко незмінний літерал`,
      },
    ],
    gotchas: [
      'const захищає змінну, readonly — поле; const obj дозволяє мутувати поля.',
      'readonly — лише compile-time, у рантаймі мутацію ніщо не блокує (на відміну від Object.freeze).',
      'readonly поверхневий: вкладені обʼєкти лишаються змінними (потрібен DeepReadonly або as const).',
      'readonly T[] прибирає мутуючі методи (push/splice) — це бажана поведінка.',
      'as const звужує до літералів і робить глибоко readonly — інколи занадто строго.',
    ],
  },
  {
    id: 'ts-inheritance-polymorphism',
    title: 'Спадкування й поліморфізм у TypeScript',
    description:
      'Спадкування реалізується через class B extends A: підклас успадковує поля й методи батька, може додавати свої й перевизначати наявні (з викликом super для батьківської реалізації). Класи можуть реалізовувати інтерфейси через implements, гарантуючи відповідність контракту. Поліморфізм — можливість працювати з обʼєктами різних класів через спільний тип (базовий клас або інтерфейс), викликаючи перевизначені методи без знання конкретного типу. TS додає abstract class і abstract-методи (не мають реалізації, мусять бути перевизначені в нащадку; не можна створити екземпляр абстрактного класу). Особливість TS: типізація структурна — обʼєкт вважається сумісним із типом, якщо в нього є потрібні поля й методи (збігається «форма»), навіть без явного extends чи implements.',
    codeExamples: [
      {
        label: 'Абстрактний клас і перевизначення',
        code: `abstract class Shape {
  abstract area(): number;          // мусить реалізувати нащадок
  describe() { return "площа: " + this.area(); }
}
class Circle extends Shape {
  constructor(private r: number) { super(); }
  area() { return Math.PI * this.r ** 2; }
}`,
      },
      {
        label: 'Поліморфізм через спільний тип',
        code: `const shapes: Shape[] = [new Circle(2), new Circle(5)];
for (const s of shapes) s.area(); // викликається потрібна реалізація

interface Printable { print(): void }
class Doc implements Printable { print() {} } // implements`,
      },
    ],
    gotchas: [
      'Глибокі ієрархії спадкування крихкі — частіше краща композиція + інтерфейси.',
      'Забутий super() у конструкторі похідного класу → помилка доступу до this.',
      'Не можна створити екземпляр abstract-класу.',
      'TS структурний: клас може підійти під інтерфейс без implements — інколи несподівано.',
      'Порушення LSP: підклас, що ламає очікування базового типу, дає приховані баги.',
      'Ключове слово override явно позначає перевизначення методу; прапорець noImplicitOverride робить його обовʼязковим — захист від одруків у назві.',
    ],
  },
  {
    id: 'ts-keyof-typeof',
    title: 'Оператори типів keyof і typeof',
    description:
      'keyof — оператор, що повертає union усіх ключів типу як літеральних рядків: keyof { a: 1; b: 2 } дає "a" | "b". Зручний, щоб обмежити параметр лише наявними ключами обʼєкта. typeof (у контексті типів) — бере ЗНАЧЕННЯ (змінну, функцію, обʼєкт) і повертає його ТИП: const x = { a: 1 }; type X = typeof x. Це не той самий typeof, що в рантаймі JS — тут він працює на рівні типів. Дуже потужна зв’язка keyof typeof: спочатку беремо тип значення, потім — його ключі (типобезпечний доступ до полів існуючого обʼєкта/константи). Разом із індексованим доступом T[K] це основа generic-функцій на кшталт «дістати значення за ключем».',
    codeExamples: [
      {
        label: 'keyof і безпечний доступ',
        code: `interface User { id: number; name: string }
type UserKeys = keyof User; // "id" | "name"

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // тип результату точний
}
getProp({ id: 1, name: "Ada" }, "name"); // string`,
      },
      {
        label: 'typeof і зв’язка keyof typeof',
        code: `const config = { host: "localhost", port: 8080 };
type Config = typeof config; // { host: string; port: number }

const Roles = { admin: 1, user: 2 } as const;
type Role = keyof typeof Roles; // "admin" | "user"`,
      },
    ],
    gotchas: [
      'type-level typeof ≠ рантайм typeof — однакове слово, різні контексти.',
      'typeof застосовується до значень, не до типів (typeof SomeType — помилка).',
      'keyof для типу з index signature дає string|number, а не конкретні ключі.',
      'keyof typeof Obj без as const дасть ширші типи значень, ніж літерали.',
      'T[K] (індексований доступ) часто плутають із рантайм-доступом до поля.',
    ],
  },
  {
    id: 'ts-conditional-types',
    title: 'Conditional types — що це і як використовувати',
    description:
      'Conditional type — тип, що обирається за умовою, із синтаксисом T extends U ? X : Y: «якщо T сумісний з U, то X, інакше Y». Це тернарний оператор на рівні типів. Усередині умовного типу доступне ключове слово infer, яке дозволяє «витягти» тип із позиції (наприклад, тип елемента масиву чи значення, що повертає функція) — саме так реалізовані ReturnType і Awaited. Важлива особливість: коли T — це union, умовний тип «дистрибутивний» — застосовується до кожного члена окремо (T extends U ? ... перебирає union поелементно). Conditional types — інструмент для бібліотечних і узагальнених типів, де результат залежить від вхідного типу.',
    codeExamples: [
      {
        label: 'Базова умова й дистрибутивність',
        code: `type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"

// дистрибутивно по union:
type NonNull<T> = T extends null | undefined ? never : T;
type C = NonNull<string | null>; // string`,
      },
      {
        label: 'infer — витягнути тип',
        code: `type ElementType<T> = T extends (infer E)[] ? E : T;
type E = ElementType<number[]>; // number

type MyReturn<F> = F extends (...a: any[]) => infer R ? R : never;
type R = MyReturn<() => string>; // string`,
      },
    ],
    gotchas: [
      'Дистрибутивність по union може дати несподіваний результат — вимикається через [T] extends [U].',
      'infer працює лише всередині conditional type (extends-гілки).',
      'Глибоко вкладені умовні типи дають нечитабельні помилки й тиснуть на компілятор.',
      'naked type parameter (T extends ...) дистрибутивний, обгорнутий — ні.',
      'Легко випадково отримати never через хибну умову.',
    ],
  },
  {
    id: 'ts-function-overloads',
    title: 'Перевантаження сигнатур функцій (overloading)',
    description:
      'Перевантаження дозволяє описати кілька різних сигнатур для однієї функції — коли поведінка й тип результату залежать від форми аргументів. У TS це робиться так: спочатку оголошуються кілька «сигнатур перевантаження» (лише типи, без тіла), а потім одна «сигнатура реалізації» з тілом, яка має бути сумісною з усіма перевантаженнями. Викликаючий бачить лише перевантаження, не реалізацію. Це дає точніший тип результату, ніж union параметрів. Часто кращою альтернативою є дженерики або union — перевантаження виправдане, коли різні комбінації аргументів дають принципово різні типи повернення, які важко виразити інакше. У методах/конструкторах теж працює.',
    codeExamples: [
      {
        label: 'Перевантаження функції',
        code: `function parse(x: string): string[];
function parse(x: number): number;
function parse(x: string | number): string[] | number {
  return typeof x === "string" ? x.split("") : x * 2;
}
const a = parse("hi"); // тип string[]
const b = parse(10);   // тип number`,
      },
      {
        label: 'Часто краще — дженерик/union',
        code: `// замість перевантажень інколи достатньо:
function wrap<T>(x: T): T[] { return [x]; }
wrap("a"); // string[]
wrap(1);   // number[]`,
      },
    ],
    gotchas: [
      'Сигнатура реалізації не видима ззовні — викликач бачить лише перевантаження.',
      'Реалізація мусить бути сумісна з усіма перевантаженнями, інакше помилка.',
      'TS слабко перевіряє відповідність тіла перевантаженням — легко отримати розсинхрон.',
      'Часто дженерик або union чистіші за перевантаження.',
      'Порядок перевантажень важливий — TS бере перше, що підходить.',
    ],
  },
  {
    id: 'ts-type-narrowing',
    title: 'Type narrowing (звуження типів)',
    description:
      'Type narrowing — це процес, коли TS звужує ширший тип до конкретнішого на основі перевірок у коді. Механізми: typeof (для примітивів), instanceof (для класів), перевірка in (наявність властивості), порівняння з літералом, truthiness-перевірка (if (x)), а також рівність у discriminated union (перевірка спільного поля-дискримінатора). Можна писати власні type guards — функції з типом-предикатом (x is Cat), що навчають компілятор звужувати тип. Звуження працює в межах блоку, де перевірка істинна. Це фундамент роботи з union-типами: щоб безпечно використати значення типу A | B, спершу треба довести, що саме це.',
    codeExamples: [
      {
        label: 'typeof, in, discriminated union',
        code: `function fmt(x: string | number) {
  if (typeof x === "string") return x.toUpperCase(); // тут x: string
  return x.toFixed(2);                                 // тут x: number
}

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; s: number };
function area(sh: Shape) {
  switch (sh.kind) {            // дискримінатор
    case "circle": return Math.PI * sh.r ** 2;
    case "square": return sh.s ** 2;
  }
}`,
      },
      {
        label: 'Власний type guard',
        code: `interface Cat { meow(): void }
function isCat(a: unknown): a is Cat {
  return typeof a === "object" && a !== null && "meow" in a;
}
function handle(a: Cat | Dog) {
  if (isCat(a)) a.meow(); // a звужено до Cat
}`,
      },
    ],
    gotchas: [
      'truthiness if (x) на number/string ріже також 0 і "" — не лише null/undefined.',
      'Звуження «скидається» після await чи виклику функції — TS не впевнений у незмінності.',
      'Поганий type guard (a is Cat) бреше компілятору — звуження стає небезпечним.',
      'in перевіряє лише наявність ключа, не його тип.',
      'Без exhaustiveness check (never) забутий варіант union пройде мовчки.',
    ],
  },
  {
    id: 'ts-tuples',
    title: 'Tuple types (кортежі)',
    description:
      'Tuple (кортеж) — масив із фіксованою кількістю елементів відомих типів у конкретному порядку: [string, number] — це рівно рядок, потім число. На відміну від звичайного масиву (number[]), кортеж памʼятає тип і позицію кожного елемента. Підтримує необовʼязкові елементи ([string, number?]), rest-елементи ([string, ...number[]]) і іменовані елементи для читабельності ([name: string, age: number]). Класичне застосування — повернення кількох значень із функції (як useState у React: [value, setValue]) і строго впорядковані дані. as const на масиві-літералі дає readonly-кортеж із точними типами. Важлива пастка: методи push/pop можуть порушити обіцяну довжину, бо в рантаймі це звичайний масив.',
    codeExamples: [
      {
        label: 'Кортеж і його переваги',
        code: `let pair: [string, number] = ["age", 30];
pair[0].toUpperCase(); // TS знає: [0] це string
pair[1].toFixed();     // [1] це number

// useState-стиль
function useToggle(): [boolean, () => void] {
  let on = false;
  return [on, () => { on = !on; }];
}
const [value, toggle] = useToggle();`,
      },
      {
        label: 'Опціональні, rest, named',
        code: `type Range = [start: number, end: number, step?: number];
type Args = [string, ...number[]]; // перший рядок, далі числа

const point = [1, 2] as const; // readonly [1, 2]`,
      },
    ],
    gotchas: [
      'У рантаймі кортеж — звичайний масив: push/pop можуть порушити довжину.',
      'Без readonly/as const кортеж мутабельний і легко «зламати».',
      'Іменовані елементи — лише для читабельності, на рантайм не впливають.',
      'Доступ за індексом поза межами кортежу не завжди дає помилку.',
      'Великі кортежі гірші за обʼєкти — позиційний доступ менш читабельний.',
    ],
  },
  {
    id: 'ts-alias-vs-interface',
    title: 'Type alias і interface — порівняння',
    description:
      'Type alias (type Name = ...) дає імʼя будь-якому типу: обʼєкту, union, intersection, кортежу, примітиву, функції, а також обчислюваним mapped і conditional типам. Interface описує насамперед форму обʼєктів і класів. Головні відмінності: interface підтримує declaration merging (однойменні зливаються) і extends; type — ні, але вміє те, що interface не може (union, кортежі, примітиви, обчислювані типи). Розширення: interface через extends, type через перетин &. Для опису обʼєктів вони майже взаємозамінні, тож вибір — здебільшого про стиль і конкретні можливості. Це фактично той самий матеріал, що й «interface vs type», розглянутий під кутом псевдонімів типів.',
    codeExamples: [
      {
        label: 'Що вміє лише type',
        code: `type Status = "active" | "banned";     // union
type Pair = [number, number];          // кортеж
type Fn = (x: number) => number;       // функція
type Id = string;                      // псевдонім примітива
// interface цього не вміє`,
      },
      {
        label: 'Що зручніше через interface',
        code: `interface User { id: number }
interface User { name: string } // merging → { id; name }

interface Admin extends User { role: string } // extends`,
      },
    ],
    gotchas: [
      'type не зливається — однойменні type це помилка, однойменні interface обʼєднуються.',
      'union/кортежі/примітиви/обчислювані типи — лише через type.',
      'extends (interface) і & (type) не ідентичні: перетин може дати never при конфлікті.',
      'declaration merging interface — і зручність, і ризик неочікуваного розширення.',
      'Непослідовне змішування type/interface у кодбазі шкодить читабельності.',
    ],
  },
  {
    id: 'ts-optional-required',
    title: 'Опціональні й обовʼязкові властивості в інтерфейсах',
    description:
      'Властивість можна позначити необовʼязковою через ?: { name: string; age?: number } — поле age можна не вказувати, і його тип стає number | undefined. Без ? властивість обовʼязкова. Це впливає на перевірки: до опціонального поля треба звертатися обережно (через ?. або після перевірки). Утиліти Partial<T> роблять усі поля опціональними, Required<T> — навпаки, усі обовʼязковими. Важлива тонкість: опціональне поле (age?) і поле типу number | undefined — не зовсім те саме: перше можна взагалі не писати в обʼєкті, а друге треба вказати явно (хоч і як undefined). Налаштування exactOptionalPropertyTypes робить цю різницю строгою.',
    codeExamples: [
      {
        label: 'Опціональні поля',
        code: `interface User {
  id: number;        // обовʼязкове
  name: string;
  age?: number;      // опціональне → number | undefined
}
const u: User = { id: 1, name: "Ada" }; // ✅ age можна пропустити
u.age?.toFixed();  // безпечний доступ`,
      },
      {
        label: 'Partial / Required і різниця з | undefined',
        code: `interface Form { title: string; note: string }
type Draft = Partial<Form>;   // усі поля опціональні
type Full = Required<Draft>;  // усі знову обовʼязкові

interface A { x?: number }            // можна не писати x
interface B { x: number | undefined } // x треба вказати (хоч undefined)`,
      },
    ],
    gotchas: [
      'age?: number і age: number | undefined різняться: перше можна не вказувати взагалі.',
      'exactOptionalPropertyTypes робить цю різницю строгою — без нього TS ліберальний.',
      'До опціонального поля треба звертатись через ?. або після перевірки.',
      'Багато опціональних полів — запах: можливо, тип треба розділити.',
      'Partial<T> поверхневий — вкладені обʼєкти не стають опціональними.',
    ],
  },
  {
    id: 'ts-never',
    title: 'Тип never — що це і коли використовувати',
    description:
      'never — це тип значення, якого не може бути. Він зʼявляється там, де значення в принципі не повертається або неможливе: функція, що завжди кидає виняток або має нескінченний цикл (не повертає); гілка коду, недосяжна після вичерпного звуження; порожній union; перетин несумісних типів. never — підтип усіх типів (його можна присвоїти будь-куди), але йому не можна присвоїти нічого, крім never. Головне практичне застосування — exhaustiveness check: у switch по union присвоєння змінній типу never у гілці default змушує компілятор кинути помилку, якщо зʼявився необроблений варіант. Не плутати з void (функція нічого корисного не повертає, але завершується) і з unknown (будь-яке значення).',
    codeExamples: [
      {
        label: 'Функція, що не повертає',
        code: `function fail(msg: string): never {
  throw new Error(msg); // ніколи не повертає значення
}
function loop(): never {
  while (true) {}
}`,
      },
      {
        label: 'Exhaustiveness check',
        code: `type Shape = { kind: "circle" } | { kind: "square" };
function area(s: Shape) {
  switch (s.kind) {
    case "circle": return 1;
    case "square": return 2;
    default:
      const _exhaustive: never = s; // помилка, якщо додали новий kind
      return _exhaustive;
  }
}`,
      },
    ],
    gotchas: [
      'never ≠ void: void — функція завершується без значення, never — не завершується взагалі.',
      'never можна присвоїти будь-куди, але йому — лише never.',
      'Несподіваний never часто означає «схлопнутий» union або неможливий перетин.',
      'Дистрибутивні conditional типи над порожнім union дають never.',
      'Exhaustiveness через never працює лише з правильним discriminated union.',
    ],
  },
  {
    id: 'ts-null-undefined-handling',
    title: 'Робота з null і undefined у типах',
    description:
      'За замовчуванням (без strictNullChecks) TS дозволяє null/undefined у будь-якому типі — це небезпечно. З увімкненим strictNullChecks (частина strict) null і undefined стають окремими типами, які треба явно додавати в union (string | null) і обробляти перед використанням, інакше — помилка компіляції. Інструменти роботи: optional chaining ?. (безпечний доступ, повертає undefined замість падіння), nullish coalescing ?? (дефолт лише для null/undefined, на відміну від ||), non-null assertion ! (обіцянка компілятору «тут точно не null» — на свій ризик), type guards (if (x != null)), утиліта NonNullable<T>. Це фундамент захисту від найпоширенішої помилки рантайму — «cannot read property of undefined».',
    codeExamples: [
      {
        label: '?. ?? і звуження',
        code: `interface User { name: string; address?: { city?: string } }
function city(u: User) {
  return u.address?.city ?? "невідомо"; // безпечно + дефолт
}

function len(s: string | null) {
  if (s == null) return 0; // звуження прибирає null і undefined
  return s.length;
}`,
      },
      {
        label: 'non-null assertion і NonNullable',
        code: `const el = document.getElementById("app")!; // ! — «точно не null»
el.classList.add("x");

type T = NonNullable<string | null | undefined>; // string`,
      },
    ],
    gotchas: [
      'Без strictNullChecks null/undefined дозволені скрізь — обовʼязково вмикайте.',
      '|| ріже 0/""/false; для «лише null/undefined» потрібен ??.',
      'non-null assertion ! не перевіряється компілятором — той самий ризик, що й приведення.',
      '?. зупиняє ланцюг на першому null/undefined, повертаючи undefined.',
      '!= null зручно ловить і null, і undefined; === null — лише null.',
    ],
  },
  {
    id: 'ts-type-assertions',
    title: 'Type assertions (приведення типів)',
    description:
      'Type assertion — це спосіб сказати компілятору «довірся мені, я знаю тип цього значення точніше за тебе», через синтаксис value as Type (або старий <Type>value). Це НЕ перетворення в рантаймі (на відміну від приведення в інших мовах) — жодного коду не генерується, лише змінюється точка зору компілятора. Тому assertion небезпечний: якщо ви помилились, помилка зʼявиться в рантаймі, бо TS вам повірив. Дозволені лише «сумісні» приведення; для зовсім несумісних потрібен подвійний каст через unknown (x as unknown as Y) — це явний сигнал «я роблю щось ризиковане». Окремий випадок — const assertion (as const), що звужує до літералів і робить readonly. Альтернатива assertion — type guards, які перевіряють тип реально.',
    codeExamples: [
      {
        label: 'as і небезпека',
        code: `const data = JSON.parse(s) as { id: number }; // обіцянка, не перевірка
const input = document.querySelector("input") as HTMLInputElement;
input.value; // TS більше не сумнівається

// подвійний каст для несумісних типів:
const n = ("5" as unknown) as number; // ризиковано — TS не зупинить`,
      },
      {
        label: 'as const',
        code: `const config = { mode: "dark", retries: 3 } as const;
// тип: { readonly mode: "dark"; readonly retries: 3 }`,
      },
    ],
    gotchas: [
      'as — це не рантайм-перетворення, лише зміна точки зору компілятора.',
      'Помилковий assertion переносить баг у рантайм — TS вам повірив.',
      'as на даних із API лише вдає тип — реально їх ніхто не валідував.',
      'Подвійний каст as unknown as Y — червоний прапор, ознака небезпечного коду.',
      'as const — безпечний виняток: звужує до літералів, нічого не «обіцяє» хибно.',
    ],
  },
  {
    id: 'ts-union-intersection',
    title: 'Union і intersection типи',
    description:
      'Union (A | B) — «АБО»: значення може бути одного з кількох типів. Працювати з ним можна лише після звуження (typeof, дискримінатор), а напряму доступні тільки спільні для всіх членів властивості. Intersection (A & B) — «І»: значення мусить задовольняти всі типи одночасно, обʼєднуючи їхні поля. Union найчастіше використовують для «одне з кількох» (string | number, статуси, варіанти даних), особливо як discriminated union зі спільним полем-дискримінатором. Intersection — для комбінування кількох контрактів в один (міксини, розширення обʼєкта). Важлива тонкість: перетин примітивів-несумісних дає never (string & number неможливо), а union звужує доступні операції до спільного підмножини.',
    codeExamples: [
      {
        label: 'Union і доступ до спільного',
        code: `type Id = string | number;
function show(id: Id) {
  // id.toFixed(); // ❌ є лише в number
  return String(id); // ✅ спільна операція
}

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number }; // discriminated union`,
      },
      {
        label: 'Intersection — обʼєднання контрактів',
        code: `type WithId = { id: number };
type WithName = { name: string };
type Entity = WithId & WithName; // мусить мати і id, і name
const e: Entity = { id: 1, name: "Ada" };`,
      },
    ],
    gotchas: [
      'З union доступні лише спільні властивості — для решти треба звуження.',
      'Перетин несумісних примітивів дає never (string & number).',
      'Для обʼєктів & розширює (більше полів), для примітивів — звужує — контрінтуїтивно.',
      'union без дискримінатора важко звужувати — додавайте спільне поле kind.',
      'Конфлікт однойменних полів у intersection може дати never для цього поля.',
    ],
  },
  {
    id: 'ts-as-vs-angle-bracket',
    title: 'Різниця між as і кутовими дужками (<Type>) для приведення',
    description:
      'У TypeScript є два синтаксиси type assertion. Сучасний — value as Type. Старий — <Type>value (кутові дужки перед значенням). Семантично вони ідентичні — роблять те саме приведення. Але є критична відмінність: синтаксис із кутовими дужками НЕ працює у .tsx-файлах (React), бо <Type> конфліктує з JSX-тегами — компілятор не може відрізнити приведення від елемента. Тому as — фактичний стандарт, особливо у фронтенді з React. Кутові дужки залишилися переважно в старому коді й у не-JSX контексті. Рекомендація лінтерів (typescript-eslint) — завжди використовувати as заради однаковості й сумісності з JSX.',
    codeExamples: [
      {
        label: 'Два синтаксиси',
        code: `const a = value as string;   // ✅ сучасний, працює всюди
const b = <string>value;     // те саме, але НЕ в .tsx

// у .tsx це сприйметься як JSX-тег і дасть помилку:
// const c = <string>value;  // ❌ конфлікт із JSX`,
      },
      {
        label: 'Чому as безпечніший за стилем',
        code: `// у React-файлі (.tsx) лише as:
const el = ref.current as HTMLDivElement;
// <HTMLDivElement>ref.current — зламає парсинг JSX`,
      },
    ],
    gotchas: [
      'Кутові дужки <Type>value не працюють у .tsx — конфлікт із JSX.',
      'Семантично обидва синтаксиси ідентичні — різниця лише в сумісності.',
      'as — дефакто-стандарт; лінтери радять саме його.',
      'Обидва синтаксиси не перевіряються в рантаймі — ризик однаковий.',
      'У не-JSX .ts-файлах кутові дужки технічно працюють, але краще уникати для однаковості.',
    ],
  },
  {
    id: 'ts-ambient-declaration-merging',
    title: 'Ambient declarations і declaration merging',
    description:
      'Проблема, яку це розвʼязує: TypeScript має знати типи всього, з чим працює код, але частина коду існує ПОЗА вашим проєктом — стара JS-бібліотека без типів, глобальна змінна від бандлера чи стороннього скрипта, імпорти картинок і стилів. Ambient declaration — оголошення через ключове слово declare, яке каже компілятору: «такий код десь існує, ось його типи, повір мені». Воно лише описує типи й не генерує жодного JS-коду. Живуть такі оголошення у файлах .d.ts: declare const — описати глобальну змінну, declare global — розширити глобальні типи, declare module "*.svg" — навчити TS розуміти імпорт нестандартних файлів. Declaration merging — споріднений механізм: TS уміє ОБʼЄДНУВАТИ кілька однойменних оголошень в одне. Два interface з однаковим імʼям зливаються в один — так можна «дописати» поле у вбудований Window або розширити типи чужої бібліотеки, не чіпаючи її код. Разом ці два механізми — основа типізації стороннього й глобального коду.',
    codeExamples: [
      {
        label: 'Ambient declarations (.d.ts)',
        code: `// globals.d.ts
declare const __VERSION__: string; // глобальна змінна від бандлера

declare module "*.svg" {           // імпорт нестандартних файлів
  const src: string;
  export default src;
}

// CSS-модулі: ключі — імена класів, значення — згенеровані імена
declare module "*.module.scss" {
  const styles: { [className: string]: string };
  export default styles;
}
// тепер import styles from "./s.module.scss" не дає помилки`,
      },
      {
        label: 'Declaration merging — розширити глобальне',
        code: `// розширюємо вбудований Window
declare global {
  interface Window { myAnalytics: (e: string) => void }
}
window.myAnalytics("click"); // тепер типізовано
export {}; // робить файл модулем`,
      },
    ],
    gotchas: [
      'declare лише описує типи — коду не генерує; помилка в описі = баг у рантаймі.',
      'Для declare global / розширення модуля файл часто має бути модулем (export {}).',
      'Глобальні розширення невидимі в місці використання — ускладнюють розуміння.',
      'Однойменні interface зливаються мовчки — можна ненавмисно щось додати.',
      'Зливаються не лише інтерфейси: namespace може злитися з класом або функцією — так їм додають «статичні» члени.',
      'Неправильний declare module *.svg ламає типізацію всіх таких імпортів.',
    ],
  },
  {
    id: 'ts-tsconfig',
    title: 'Налаштування проєкту через tsconfig.json',
    description:
      'tsconfig.json — конфігураційний файл, що визначає, як компілювати TypeScript-проєкт. Ключові секції: compilerOptions (опції компілятора), include/exclude/files (які файли брати), extends (успадкувати базовий конфіг), references (project references для монорепо). Важливі опції: target (версія JS на виході), module (система модулів), lib (доступні API), strict (увімкнути всі строгі перевірки), moduleResolution (як шукати модулі — bundler/node), jsx (режим JSX), paths/baseUrl (аліаси імпортів), outDir/rootDir, noEmit (не генерувати JS — корисно коли збирає бандлер), esModuleInterop, skipLibCheck. У великих проєктах часто кілька файлів (tsconfig.app.json, tsconfig.node.json) через references.',
    codeExamples: [
      {
        label: 'Типовий tsconfig.json',
        code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "noEmit": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}`,
      },
      {
        label: 'Аліаси й строгі додаткові перевірки',
        code: `{
  "compilerOptions": {
    "noUncheckedIndexedAccess": true, // доступ за ключем → T | undefined
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true
  }
}`,
      },
    ],
    gotchas: [
      'strict не вмикає все: noUncheckedIndexedAccess, exactOptionalPropertyTypes — окремо.',
      'paths/baseUrl знає лише TS — бандлеру потрібен власний аліас-резолвер.',
      'noEmit потрібен, коли транспіляцію робить бандлер, інакше TS теж генерує JS.',
      'skipLibCheck прискорює, але пропускає помилки в .d.ts залежностей.',
      'Додавати строгість у старий проєкт боляче — вмикайте strict на старті.',
      'Для npm-пакетів вмикають declaration: true — TypeScript генерує .d.ts поруч зі збіркою.',
    ],
  },
  {
    id: 'ts-strict-mode',
    title: 'Strict mode у TypeScript і його переваги',
    description:
      'strict: true у tsconfig — це «парасолька», що вмикає набір строгих перевірок одразу. Серед них: strictNullChecks (null/undefined стають окремими типами, які треба обробляти), noImplicitAny (заборона неявного any — кожен нетипізований параметр треба типізувати), noImplicitThis (помилка, якщо this не має явного типу), strictFunctionTypes (строга перевірка сумісності функцій), strictBindCallApply, strictPropertyInitialization (поля класу мають бути ініціалізовані), alwaysStrict (use strict + парсинг у strict mode), useUnknownInCatchVariables (помилка в catch стає unknown). Перевага — TS ловить набагато більше помилок на етапі компіляції, особливо найпоширеніші null-падіння й «забутий тип». Це не окремий режим, а просто сукупність прапорів, які можна вмикати й по одному.',
    codeExamples: [
      {
        label: 'Що змінює strict',
        code: `// noImplicitAny: параметр без типу — помилка
function f(x) { return x; } // ❌ x неявно any

// strictNullChecks: null треба обробити
function len(s: string | null) {
  // return s.length; // ❌
  return s?.length ?? 0; // ✅
}`,
      },
      {
        label: 'strictPropertyInitialization',
        code: `class User {
  name: string;        // ❌ не ініціалізовано
  age!: number;        // ✅ ! — «ініціалізую пізніше»
  constructor() { this.name = "Ada"; }
}`,
      },
    ],
    gotchas: [
      'strict — це набір прапорів; можна вмикати по одному при міграції.',
      'Ретроспективне ввімкнення у великому проєкті дає лавину помилок — вмикайте на старті.',
      'strictPropertyInitialization вимагає ініціалізації полів класу (або ! / ?).',
      'strict НЕ вмикає noUncheckedIndexedAccess та деякі інші — додавайте окремо.',
      'useUnknownInCatchVariables робить помилку в catch типом unknown — треба звужувати.',
    ],
  },
]
