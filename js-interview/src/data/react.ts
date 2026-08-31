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

export const reactTopics: Topic[] = [
  {
    id: 'hoc',
    title: 'Що таке Higher-Order Component (HOC)',
    description:
      'HOC (компонент вищого порядку) — це функція, яка приймає компонент і повертає новий компонент із доданою поведінкою. Це не частина React API, а патерн, що ґрунтується на композиції: withAuth(Component), connect(mapState)(Component). HOC «обгортає» вихідний компонент, додаючи йому пропси, логіку, дані чи перевірки, не змінюючи його самого. Класичні приклади — connect із react-redux, withRouter. Сьогодні HOC значною мірою витіснені хуками, які роблять те саме чистіше, без зайвого вкладення в дереві компонентів. Важливі правила HOC: не мутувати оригінал, прокидати решту пропсів через ...props, копіювати статичні методи й коректно прокидати ref (через forwardRef).',
    codeExamples: [
      {
        label: 'Простий HOC',
        code: `function withLoading(Component) {
  return function Wrapped({ isLoading, ...props }) {
    if (isLoading) return <Spinner />;
    return <Component {...props} />; // прокидаємо решту пропсів
  };
}
const UserListWithLoading = withLoading(UserList);`,
      },
      {
        label: 'Сьогодні — частіше хук',
        code: `// замість HOC withUser(Component):
function useUser() {
  const [user, setUser] = useState(null);
  useEffect(() => { /* fetch */ }, []);
  return user;
}
function Profile() {
  const user = useUser(); // логіка перевикористовується без обгортки
  return <div>{user?.name}</div>;
}`,
      },
    ],
    gotchas: [
      'Створення HOC усередині render → новий тип компонента щоразу → повний ремоунт і втрата стану.',
      'Колізії пропсів: два HOC можуть передати поле з однаковим іменем.',
      'Ref не прокидається автоматично — потрібен forwardRef.',
      'Статичні методи обгорнутого компонента губляться, якщо їх не скопіювати.',
      '«Wrapper hell» — глибоке вкладення обгорток ускладнює дебаг; хуки чистіші.',
    ],
  },
  {
    id: 'hooks',
    title: 'Що таке hooks',
    description:
      'Hooks — це функції, що дозволяють використовувати стан і інші можливості React у функціональних компонентах (зʼявилися в React 16.8). До них стан і життєвий цикл були доступні лише в класах. Назва завжди починається з use (useState, useEffect…). Хуки «чіпляють» компонент до внутрішніх механізмів React. Є суворі правила: викликати хуки можна лише на верхньому рівні компонента чи іншого хука (не в умовах, циклах, вкладених функціях) і лише з React-функцій. Це тому, що React розпізнає хуки за порядком виклику — порядок має бути стабільним між рендерами. Хуки зробили можливим витягувати й перевикористовувати логіку через кастомні хуки замість HOC і render props.',
    codeExamples: [
      {
        label: 'Базові хуки',
        code: `function Counter() {
  const [count, setCount] = useState(0); // стан
  useEffect(() => {                       // побічний ефект
    document.title = "Лічильник: " + count;
  }, [count]);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
      },
      {
        label: 'Кастомний хук',
        code: `function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w;
}`,
      },
    ],
    gotchas: [
      'Не можна викликати хуки в умовах/циклах/вкладених функціях — лише на верхньому рівні.',
      'React розрізняє хуки за порядком виклику — порядок має бути стабільним.',
      'Неповний масив залежностей → stale closure (колбек бачить старі значення).',
      'Хуки викликаються лише з React-компонентів чи інших хуків.',
      'Кастомний хук має починатися з use, інакше лінтер не застосує правила.',
    ],
  },
  {
    id: 'hooks-list',
    title: 'Які хуки є в React',
    definition:
      'Основні: useState (локальний стан), useEffect (побічні ефекти після рендеру), useContext (читання контексту). Додаткові: useReducer (стан зі складною логікою через reducer), useRef (мутабельне посилання, що переживає рендери, та доступ до DOM), useMemo (кешування обчислень), useCallback (кешування функції), useLayoutEffect (ефект синхронно до перемальовування), useImperativeHandle (налаштування ref). Сучасні (React 18+): useTransition і useDeferredValue (неблокуючі оновлення/пріоритети), useId (стабільні id для SSR), useSyncExternalStore (підписка на зовнішні стори), useInsertionEffect (для CSS-in-JS). React 19 додав use (читати проміс/контекст), useActionState, useOptimistic, useFormStatus. Плюс кастомні хуки, які ви пишете самі.',
    description:
      `Три основні, без яких не обходиться жоден компонент:
• useState — локальний стан; повертає значення і сеттер, виклик якого запускає ререндер.
• useEffect — побічні ефекти після рендеру (запити, підписки, таймери); масив залежностей вирішує, коли ефект повториться, а повернена функція прибирає за собою.
• useContext — читає значення найближчого Provider, не прокидаючи пропси через усе дерево.

Додаткові — для стану, посилань і оптимізації:
• useReducer — той самий стан, але коли переходів багато й вони повʼязані: логіка живе в reducer(state, action).
• useRef — контейнер .current, який переживає рендери і НЕ викликає ререндер; ним же беруть DOM-вузол.
• useMemo — кешує результат важкого обчислення між рендерами.
• useCallback — кешує саму функцію, щоб не ламати memo у дочірніх компонентів.
• useLayoutEffect — як useEffect, але синхронно до перемальовування: коли треба виміряти DOM без «мигання».
• useImperativeHandle — вирішує, що саме батько отримає через ref на ваш компонент.

Сучасні (React 18+) — про пріоритети й зовнішні дані:
• useTransition — позначає оновлення як нетермінове, щоб важкий ререндер не блокував ввід; дає прапорець isPending.
• useDeferredValue — те саме, але для одного значення: віддає його «відкладену» копію, поки готується нова.
• useId — стабільний унікальний id, однаковий на сервері й клієнті.
• useSyncExternalStore — безпечна підписка на зовнішнє сховище.
• useInsertionEffect — вузький хук для CSS-in-JS: вставляє стилі до розрахунку layout.

React 19 додав:
• use — читає проміс або контекст прямо в рендері, разом із Suspense.
• useActionState — стан форми навколо асинхронної дії.
• useOptimistic — показує результат одразу, до відповіді сервера.
• useFormStatus — статус відправки форми в дочірньому компоненті.

Плюс кастомні хуки — власні функції з префіксом use, що комбінують стандартні для перевикористання логіки.`,
    codeExamples: [
      {
        label: 'Найуживаніші',
        code: `const [state, setState] = useState(0);
const [s, dispatch] = useReducer(reducer, initial);
const value = useContext(MyContext);
const ref = useRef(null);
const memo = useMemo(() => heavy(a), [a]);
const cb = useCallback(() => doX(id), [id]);
useEffect(() => { /* side effect */ }, [dep]);`,
      },
      {
        label: 'Сучасні (18 / 19)',
        code: `const [isPending, startTransition] = useTransition();
const deferred = useDeferredValue(query);
const id = useId();
// React 19:
const data = use(promiseOrContext);`,
      },
    ],
    gotchas: [
      'useMemo/useCallback не варто ставити скрізь — передчасна оптимізація ускладнює код.',
      'useLayoutEffect блокує перемальовування — зловживання шкодить продуктивності.',
      'useInsertionEffect — вузький інструмент для CSS-in-JS, не для звичайної логіки.',
      'useEffect і useState — різні задачі; плутати їх (ефект для похідних даних) — антипатерн.',
      'Нові хуки React 19 (use, useOptimistic) доступні не в усіх версіях/налаштуваннях.',
    ],
  },
  {
    id: 'lifecycle-methods',
    title: 'Усі lifecycle methods у React (класи)',
    description:
      'Методи життєвого циклу класового компонента діляться на три фази. Монтування: constructor → static getDerivedStateFromProps → render → componentDidMount (компонент уже в DOM — місце для запитів, підписок). Оновлення (при зміні props/state): static getDerivedStateFromProps → shouldComponentUpdate (чи рендерити взагалі) → render → getSnapshotBeforeUpdate (зняти інфо з DOM до змін) → componentDidUpdate. Розмонтування: componentWillUnmount (очищення підписок, таймерів). Обробка помилок: static getDerivedStateFromError і componentDidCatch (error boundaries). Застарілі (з префіксом UNSAFE_): componentWillMount, componentWillReceiveProps, componentWillUpdate — їх не варто використовувати. У функціональних компонентах усе це замінює useEffect/useLayoutEffect.',
    codeExamples: [
      {
        label: 'Основні методи',
        code: `class Widget extends React.Component {
  constructor(props) { super(props); this.state = { data: null }; }
  componentDidMount() { /* fetch, підписки */ }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) { /* реакція на зміну */ }
  }
  componentWillUnmount() { /* очищення */ }
  render() { return <div>{this.state.data}</div>; }
}`,
      },
      {
        label: 'Error boundary',
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { logError(err, info); }
  render() {
    return this.state.hasError ? <Fallback /> : this.props.children;
  }
}`,
      },
    ],
    gotchas: [
      'componentWillMount/WillReceiveProps/WillUpdate застарілі (UNSAFE_) — несумісні з конкурентним режимом.',
      'Забутий componentWillUnmount → витоки памʼяті (підписки, таймери лишаються).',
      'Error boundaries досі лише класові — хуками їх не реалізувати.',
      'setState у componentDidUpdate без умови → нескінченний цикл.',
      'getDerivedStateFromProps статичний і не має доступу до this — часто його зловживають.',
    ],
  },
  {
    id: 'class-vs-function',
    title: 'Відмінність класових і функціональних компонентів',
    description:
      'Класовий компонент — це клас, що наслідує React.Component, має this, state і методи життєвого циклу (componentDidMount тощо). Функціональний — це звичайна функція, що приймає props і повертає JSX; стан і ефекти отримує через хуки (useState, useEffect). Раніше класи були єдиним способом мати стан, а функції були «дурними» (presentational). З появою хуків (16.8) функціональні компоненти отримали всі можливості, і тепер вони — рекомендований стандарт. Відмінності: у функціях немає this й проблем із його привʼязкою; логіка групується за змістом (один useEffect на одну задачу), а не розкидана по методах; легше витягувати логіку в кастомні хуки. Класи лишилися переважно для error boundaries й у легасі.',
    codeExamples: [
      {
        label: 'Той самий компонент',
        code: `// Класовий
class Hi extends React.Component {
  state = { n: 0 };
  render() {
    return <button onClick={() => this.setState({ n: this.state.n + 1 })}>
      {this.state.n}
    </button>;
  }
}
// Функціональний
function Hi() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`,
      },
      {
        label: 'props у замиканні vs this.props',
        code: `// у функції props «заморожені» для конкретного рендеру (замикання)
// у класі this.props завжди актуальні — звідси різна поведінка
// в асинхронних колбеках`,
      },
    ],
    gotchas: [
      'У класі this.props завжди свіжі; у функції кожен рендер «заморожує» свої props/state (замикання).',
      'У класах легко забути bind методів — this злітає в колбеках.',
      'Логіка в класах розкидана по методах; у функціях групується за змістом.',
      'Error boundaries — лише класи.',
      'Не варто масово переписувати робочі класи на функції без причини.',
    ],
  },
  {
    id: 'virtual-dom',
    title: 'Що таке Virtual DOM',
    description:
      'Virtual DOM — це легке представлення реального DOM у вигляді обʼєктів JavaScript. Коли стан змінюється, React будує нове віртуальне дерево, порівнює його з попереднім (процес diffing/reconciliation) і обчислює мінімальний набір змін, які потрібно застосувати до реального DOM. Прямі маніпуляції з реальним DOM дорогі (reflow/repaint), тому React батчить і мінімізує їх. Це дає декларативну модель: ви описуєте, яким UI має бути для поточного стану, а React сам розбирається, що саме змінити. Важливо: Virtual DOM — не магія швидкості сам по собі, а спосіб зробити декларативний код достатньо ефективним. У новіших підходах (Svelte, Solid) від нього відмовляються на користь компіляції.',
    codeExamples: [
      {
        label: 'Що це по суті',
        code: `// JSX
const el = <div className="box">Hi</div>;
// перетворюється на обʼєкт (спрощено):
const el = {
  type: "div",
  props: { className: "box", children: "Hi" },
};
// React порівнює такі обʼєкти між рендерами`,
      },
      {
        label: 'Декларативність',
        code: `// ви описуєте РЕЗУЛЬТАТ для стану:
function List({ items }) {
  return <ul>{items.map(i => <li key={i.id}>{i.text}</li>)}</ul>;
}
// React сам обчислює, які <li> додати/прибрати/змінити`,
      },
    ],
    gotchas: [
      'Virtual DOM не «швидший» автоматично — це ціна за декларативність, не магія.',
      'Без правильних key diffing списків працює неоптимально й плутає елементи.',
      'Побудова й порівняння дерев теж коштують — звідси мемоізація.',
      'Не плутати Virtual DOM (обʼєкти React) із Shadow DOM (інкапсуляція веб-компонентів).',
      'Великі дерева без оптимізацій усе одно гальмують — VDOM не рятує від поганої архітектури.',
    ],
  },
  {
    id: 'memoization',
    title: 'Що таке memoization (мемоізація)',
    description:
      'Мемоізація — це кешування результату обчислення, щоб не виконувати його повторно з тими самими вхідними даними. У React це три інструменти. useMemo(fn, deps) — кешує РЕЗУЛЬТАТ обчислення, перераховує лише коли змінюються залежності. useCallback(fn, deps) — кешує саму ФУНКЦІЮ (щоб не створювати нову щоренду, що важливо для дочірніх компонентів і залежностей). React.memo(Component) — обгортка, що пропускає ререндер компонента, якщо його props не змінилися (порівняння поверхневе, за посиланням). Мета — уникнути зайвих обчислень і ререндерів. Але мемоізація сама має вартість (кеш, порівняння), тому її застосовують прицільно, а не скрізь.',
    codeExamples: [
      {
        label: 'useMemo і useCallback',
        code: `const sorted = useMemo(
  () => bigList.slice().sort(cmp), // важке обчислення
  [bigList]                         // лише коли змінився список
);
const handleClick = useCallback(
  () => onSelect(id),
  [id]                              // стабільна функція для дочірнього
);`,
      },
      {
        label: 'React.memo',
        code: `const Row = React.memo(function Row({ item }) {
  return <li>{item.name}</li>;
});
// Row не ререндериться, якщо item (за посиланням) не змінився`,
      },
    ],
    gotchas: [
      'React.memo робить ПОВЕРХНЕВЕ порівняння — новий обʼєкт/функція в пропсах зведе мемо нанівець.',
      'useMemo/useCallback самі мають вартість — не ставте їх скрізь без потреби.',
      'useMemo не гарантує збереження значення — React може скинути кеш (це лише оптимізація).',
      'Неправильні залежності → застаріле кешоване значення (stale).',
      'React Compiler (React 19) автоматизує мемоізацію — ручна стане рідшою.',
    ],
  },
  {
    id: 'state-vs-props',
    title: 'Різниця між state і props',
    description:
      'props (properties) — це дані, які компонент отримує ЗВЕРХУ від батька. Вони доступні лише для читання (immutable) всередині компонента — їх не можна змінювати, лише використовувати. state — це внутрішні дані компонента, якими він володіє й керує сам; стан можна змінювати (через setState/функцію оновлення), і його зміна викликає ререндер. Просте правило: props приходять ззовні й контролюються батьком; state живе всередині й контролюється самим компонентом. Дані «течуть униз» (one-way data flow): батько передає state дитині як props. Якщо дитині треба змінити дані батька — батько передає вниз колбек. Спільні дані «піднімають» (lifting state up) до найближчого спільного предка.',
    codeExamples: [
      {
        label: 'props зверху, state всередині',
        code: `function Parent() {
  const [count, setCount] = useState(0); // state — належить Parent
  return <Child value={count} onInc={() => setCount(count + 1)} />;
}
function Child({ value, onInc }) {       // props — отримані ззовні
  // value змінювати не можна, лише читати
  return <button onClick={onInc}>{value}</button>;
}`,
      },
      {
        label: 'props лише для читання',
        code: `function Bad({ user }) {
  user.name = "X"; // ❌ ніколи не мутуйте props
  return <div>{user.name}</div>;
}`,
      },
    ],
    gotchas: [
      'props не можна мутувати — вони read-only; зміна має йти від власника стану.',
      'Копіювання props у state («ініціалізую state з props») → розсинхрон при зміні props.',
      'Зміна state тригерить ререндер; зміна звичайної змінної — ні.',
      'Глибоке прокидання props через багато рівнів (prop drilling) — привід для Context.',
      'Мутація обʼєкта в state замість створення нового → React не побачить зміну.',
    ],
  },
  {
    id: 'controlled-uncontrolled',
    title: 'Контрольовані й неконтрольовані компоненти',
    description:
      'Йдеться про роботу з формами. Контрольований компонент (controlled) — значення інпута зберігається в React-стані, а інпут отримує його через value і повідомляє про зміни через onChange. React — єдине джерело правди; ви повністю контролюєте значення (можете валідувати, форматувати, блокувати ввід). Неконтрольований компонент (uncontrolled) — значення зберігає сам DOM, а ви читаєте його за потреби через ref (зазвичай при сабміті). Тут джерело правди — DOM, а React не стежить за кожним натисканням. Контрольовані дають більше контролю й передбачуваності (рекомендований дефолт), неконтрольовані простіші й менше ререндерять — зручні для простих форм, файлових інпутів (file завжди uncontrolled) та інтеграції з не-React кодом.',
    codeExamples: [
      {
        label: 'Контрольований',
        code: `function Form() {
  const [name, setName] = useState("");
  return (
    <input
      value={name}                         // значення зі стану
      onChange={e => setName(e.target.value)} // React керує
    />
  );
}`,
      },
      {
        label: 'Неконтрольований (ref)',
        code: `function Form() {
  const ref = useRef(null);
  const submit = () => console.log(ref.current.value); // читаємо з DOM
  return <input ref={ref} defaultValue="" />; // defaultValue, не value
}`,
      },
    ],
    gotchas: [
      'value без onChange робить інпут read-only — React видасть попередження.',
      'Контрольований інпут ререндериться на кожне натискання — на великих формах помітно.',
      'file-інпут завжди неконтрольований (не можна задати value програмно).',
      'Перемикання value між undefined і рядком → попередження «controlled → uncontrolled».',
      'Для неконтрольованих використовуйте defaultValue, а не value.',
    ],
  },
  {
    id: 'flux',
    title: 'Що таке Flux',
    description:
      'Flux — це архітектурний патерн від Facebook: спосіб організувати керування станом так, щоб дані рухалися строго в ОДНОМУ напрямку по колу. Ланцюжок такий: Action (обʼєкт-опис «що сталося», наприклад «користувач додав товар») → Dispatcher (центральний вузол, що розсилає всі дії) → Store (тримає стан і оновлює його у відповідь на дію) → View (показує стан користувачу й породжує нові Action). Навіщо це: у старих підходах із двостороннім звʼязуванням View могла напряму змінювати дані, дані — інші View, і у великому застосунку ставало неможливо зрозуміти, звідки взялася зміна. Коли потік один, причина будь-якої зміни завжди простежується — стан стає передбачуваним і легко дебажиться. Важливо сказати на співбесіді: Flux — це концепція, а не бібліотека; Redux — його найвідоміша реалізація зі спрощеннями (один store замість кількох і без окремого Dispatcher).',
    codeExamples: [
      {
        label: 'Однонаправлений потік',
        code: `// Action → Dispatcher → Store → View → (нова Action)
// Дані течуть лише в один бік — це робить зміни передбачуваними

const action = { type: "ADD_TODO", text: "Вчити React" };
// dispatcher.dispatch(action) → store оновлюється → view ререндериться`,
      },
      {
        label: 'Чому не двостороннє звʼязування',
        code: `// MVC: View ↔ Model (зміни в обидва боки → каскади й хаос)
// Flux: суворо View → Action → Store → View (прогнозовано)`,
      },
    ],
    gotchas: [
      'Flux — це патерн/концепція, а не бібліотека (Redux — одна з реалізацій).',
      'Головна ідея — однонаправлений потік; порушення його зводить переваги нанівець.',
      'Класичний Flux має кілька stores і диспетчер; Redux спростив до одного стора.',
      'Плутають Flux із MVC — головна різниця саме в напрямку даних.',
      'Для простих застосунків повний Flux/Redux — надлишок (хватає useState/Context).',
    ],
  },
  {
    id: 'redux',
    title: 'Що таке Redux і як працює',
    description:
      'Redux — бібліотека для централізованого керування станом, реалізація ідей Flux. Увесь стан застосунку лежить в одному незмінному обʼєкті — store (single source of truth). Змінити стан можна лише задиспатчивши action (обʼєкт із type і payload). Чиста функція reducer (state, action) => newState обчислює новий стан, не мутуючи старий (повертає нову копію). Підписані компоненти отримують оновлення. Принципи: єдине джерело правди, стан тільки для читання (змінюється лише через actions), зміни — чистими reducer-функціями. Асинхронність і побічні ефекти додають через middleware (redux-thunk, redux-saga). Сьогодні стандарт — Redux Toolkit (RTK), що прибирає бойлерплейт і дозволяє «мутувати» стан через Immer.',
    codeExamples: [
      {
        label: 'Потік Redux',
        code: `// reducer — чиста функція
function counter(state = 0, action) {
  switch (action.type) {
    case "inc": return state + 1; // нове значення, без мутації
    default: return state;
  }
}
store.dispatch({ type: "inc" }); // єдиний спосіб змінити стан`,
      },
      {
        label: 'Redux Toolkit (сучасно)',
        code: `const slice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    inc: (state) => state + 1, // Immer дозволяє «мутувати» безпечно
  },
});
// у компоненті:
const count = useSelector(s => s.counter);
const dispatch = useDispatch();`,
      },
    ],
    gotchas: [
      'Reducer мусить бути чистим і не мутувати стан — інакше ламається порівняння й дебаг.',
      'Старий Redux багатослівний — використовуйте Redux Toolkit.',
      'Redux не потрібен для всього: серверні дані краще через React Query/RTK Query.',
      'useSelector, що повертає новий обʼєкт щоразу → зайві ререндери (потрібен мемо/shallowEqual).',
      'Асинхронність потребує middleware (thunk/saga) — у чистому Redux її немає.',
    ],
  },
  {
    id: 'pure-function',
    title: 'Що таке чиста функція',
    description:
      'Чиста функція (pure function) — функція, що задовольняє дві умови: 1) для тих самих вхідних аргументів завжди повертає той самий результат (детермінованість); 2) не має побічних ефектів (не мутує зовнішні дані, не звертається до DOM, мережі, не пише в консоль, не залежить від зовнішнього змінного стану). Чисті функції передбачувані, легко тестуються й кешуються (мемоізуються). У React це фундаментальна концепція: сам компонент має бути чистим відносно своїх props і state (рендер не повинен мати побічних ефектів — для них є useEffect), а reducer-и в useReducer/Redux обовʼязково чисті. Протилежність — «брудна» функція, яка щось змінює ззовні або залежить від мінливого контексту.',
    codeExamples: [
      {
        label: 'Чиста vs брудна',
        code: `// ✅ чиста: той самий вхід → той самий вихід, без ефектів
const add = (a, b) => a + b;

// ❌ брудна: мутує зовнішнє / залежить від зовнішнього
let total = 0;
const addToTotal = (x) => { total += x; return total; };`,
      },
      {
        label: 'Компонент і рендер мають бути чистими',
        code: `function Bad({ items }) {
  items.push("x");        // ❌ мутація props під час рендеру
  document.title = "Hi";  // ❌ побічний ефект у рендері
  return <ul>{/* ... */}</ul>;
}
// ефекти — лише в useEffect`,
      },
    ],
    gotchas: [
      'Рендер компонента має бути чистим — побічні ефекти лише в useEffect.',
      'StrictMode (dev) навмисно рендерить двічі, щоб виявити нечисті рендери.',
      'Мутація props/state під час рендеру → непередбачувана поведінка.',
      'Reducer мусить бути чистим — без запитів, рандому, дат усередині.',
      'Залежність від зовнішньої мутабельної змінної робить функцію нечистою (і нетестованою).',
    ],
  },
  {
    id: 'refs',
    title: 'Навіщо потрібні refs',
    description:
      'Ref (reference) — це спосіб отримати пряме посилання на DOM-вузол або зберегти мутабельне значення, що переживає рендери, не викликаючи ререндер при зміні. Створюється через useRef(initial); доступ — через ref.current. Два головні застосування: 1) доступ до DOM — фокус інпута, вимірювання розмірів, інтеграція з імперативними бібліотеками (анімації, графіки, відео); 2) зберігання мутабельного значення між рендерами — id таймера, попереднє значення, прапорці — без тригера ререндеру. Ключова відмінність від state: зміна ref.current НЕ викликає перемальовування. Тому ref — для даних, що не впливають на UI безпосередньо. Для DOM ref передають у атрибут ref елемента.',
    codeExamples: [
      {
        label: 'Доступ до DOM',
        code: `function Search() {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []); // фокус при монтуванні
  return <input ref={inputRef} />;
}`,
      },
      {
        label: 'Мутабельне значення без ререндеру',
        code: `function Timer() {
  const idRef = useRef(null);
  const start = () => { idRef.current = setInterval(tick, 1000); };
  const stop = () => clearInterval(idRef.current); // зберігаємо id між рендерами
  return <>{/* ... */}</>;
}`,
      },
    ],
    gotchas: [
      'Зміна ref.current НЕ викликає ререндер — для UI-даних потрібен state.',
      'Не читати/писати ref під час рендеру — лише в ефектах чи обробниках подій.',
      'ref до DOM доступний лише після монтування (у useEffect), не під час рендеру.',
      'Зловживання ref для імперативних DOM-маніпуляцій обходить декларативну модель.',
      'callback ref викликається з null при анмаунті — це треба враховувати.',
    ],
  },
  {
    id: 'rerender',
    title: 'Коли відбувається перемальовування компонента',
    description:
      'Компонент ререндериться (повторно викликається його функція) у таких випадках: 1) змінився його власний стан (setState/функція оновлення); 2) змінилися props, які він отримав; 3) ререндериться його батько (за замовчуванням ререндер батька каскадно перемальовує всіх дітей, навіть якщо їхні props не змінились); 4) змінилося значення Context, який компонент споживає; 5) примусово (forceUpdate у класах). Важливо: «ререндер» — це повторний виклик функції компонента й обчислення нового Virtual DOM, а не обовʼязково зміна реального DOM (якщо різниці немає, React нічого не чіпає в DOM). Запобігти зайвим ререндерам допомагають React.memo, useMemo, useCallback і правильна структура дерева.',
    codeExamples: [
      {
        label: 'Каскадний ререндер від батька',
        code: `function Parent() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN(n + 1)}>{n}</button>
      <Child />  {/* ререндериться РАЗОМ з Parent, хоч пропси ті самі */}
    </>
  );
}`,
      },
      {
        label: 'Запобігання',
        code: `const Child = React.memo(function Child() {
  return <div>статичне</div>; // тепер не ререндериться без зміни пропсів
});`,
      },
    ],
    gotchas: [
      'Ререндер батька каскадно перемальовує дітей, навіть з незмінними props.',
      'Ререндер ≠ оновлення реального DOM — React міняє DOM лише за наявності різниці.',
      'Зміна значення Context ререндерить ВСІХ споживачів.',
      'Новий обʼєкт/функція як проп щоренду зводить React.memo нанівець.',
      'setState тим самим значенням React може «пропустити» (бейлаут), але не завжди.',
    ],
  },
  {
    id: 'element-vs-component',
    title: 'Різниця між елементом і компонентом',
    description:
      'Component (компонент) — це функція або клас, які описують, як має виглядати частина UI; це «креслення» чи «шаблон». Element (елемент) — це звичайний незмінний обʼєкт JavaScript, що описує, що саме треба відрендерити в конкретний момент: тип (тег чи компонент), props і children. JSX <Button text="Hi" /> перетворюється на елемент — обʼєкт виду { type: Button, props: { text: "Hi" } }. Тобто компонент — це фабрика, а елемент — її конкретний «знімок». React викликає компонент, отримує елементи, будує з них дерево й рендерить. Елементи immutable: щоб оновити UI, створюється нове дерево елементів, а не змінюється старе.',
    codeExamples: [
      {
        label: 'Компонент і елемент',
        code: `// КОМПОНЕНТ — функція-«креслення»
function Button({ text }) {
  return <button>{text}</button>;
}
// ЕЛЕМЕНТ — обʼєкт-«знімок» (результат JSX)
const el = <Button text="Hi" />;
// по суті: { type: Button, props: { text: "Hi" }, ... }`,
      },
      {
        label: 'JSX → createElement',
        code: `const el = <div className="box">Hi</div>;
// компілюється у:
const el2 = React.createElement("div", { className: "box" }, "Hi");
// обидва — незмінні обʼєкти-елементи`,
      },
    ],
    gotchas: [
      'JSX створює елемент (обʼєкт), а не одразу викликає компонент.',
      'Елементи незмінні — оновлення UI = нове дерево елементів, не мутація.',
      'Компонент — функція/клас; елемент — результат її «опису» (createElement).',
      'Передавати елемент (<Icon />) як проп дешево — це лише опис, не рендер.',
      'Плутанина термінів часто заважає зрозуміти reconciliation і key.',
    ],
  },
  {
    id: 'should-component-update',
    title: 'Навіщо потрібен shouldComponentUpdate',
    description:
      'shouldComponentUpdate(nextProps, nextState) — метод життєвого циклу класового компонента, що дозволяє вручну вирішити, чи потрібен ререндер. Повертає true (рендерити, за замовчуванням) або false (пропустити ререндер і його дітей). Це інструмент оптимізації: коли ви точно знаєте, що при певних змінах UI не зміниться, можна скасувати зайву роботу. Альтернатива з готовою логікою — PureComponent, який автоматично робить поверхневе порівняння props і state. У функціональних компонентах аналог — React.memo (поверхневе порівняння props) з опціональною кастомною функцією порівняння. Важливо не зловживати: помилкове false може «заморозити» компонент і призвести до того, що UI не оновиться.',
    codeExamples: [
      {
        label: 'shouldComponentUpdate',
        code: `class Row extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.item.id !== this.props.item.id; // рендер лише при зміні id
  }
  render() { return <li>{this.props.item.name}</li>; }
}`,
      },
      {
        label: 'Функціональний аналог',
        code: `const Row = React.memo(
  ({ item }) => <li>{item.name}</li>,
  (prev, next) => prev.item.id === next.item.id // true → пропустити рендер
);`,
      },
    ],
    gotchas: [
      'Помилковий false «заморожує» компонент — UI не оновиться (підступний баг).',
      'Поверхневе порівняння не бачить змін усередині вкладених обʼєктів.',
      'Кастомна функція порівняння в React.memo повертає true, щоб ПРОПУСТИТИ рендер (легко переплутати).',
      'Передчасна оптимізація через scU/memo ускладнює код без реальної вигоди.',
      'У класах scU, у функціях — React.memo; це різні місця, та сама ідея.',
    ],
  },
  {
    id: 'hooks-didmount-unmount',
    title: 'Як хуками викликати didMount і unmount',
    description:
      'useEffect замінює методи життєвого циклу. componentDidMount відтворюється через useEffect із порожнім масивом залежностей [] — ефект виконається один раз після першого рендеру (монтування). componentWillUnmount — це функція очищення, яку ефект ПОВЕРТАЄ; вона викликається перед розмонтуванням компонента (а також перед повторним запуском ефекту). componentDidUpdate відповідає useEffect із залежностями [dep] — спрацьовує після рендерів, де dep змінився. Тобто один useEffect може покрити mount + update + unmount залежно від масиву залежностей і наявності функції очищення. Важливо: у StrictMode (dev) React навмисно монтує-розмонтовує-монтує компонент двічі, щоб виявити ефекти без коректного очищення.',
    codeExamples: [
      {
        label: 'didMount + unmount',
        code: `useEffect(() => {
  // componentDidMount: підписка, запит
  const sub = api.subscribe(onData);
  return () => {
    // componentWillUnmount: очищення
    sub.unsubscribe();
  };
}, []); // [] → один раз при монтуванні`,
      },
      {
        label: 'didUpdate (реакція на зміну)',
        code: `useEffect(() => {
  fetchUser(id); // спрацьовує при кожній зміні id
}, [id]);`,
      },
    ],
    gotchas: [
      'Cleanup-функція виконується і перед розмонтуванням, і перед кожним повторним запуском ефекту.',
      'StrictMode (dev) монтує двічі — виявляє ефекти без коректного очищення.',
      'Порожній [] — один раз; відсутність масиву — після КОЖНОГО рендеру (часта помилка).',
      'Неповні залежності → ефект бачить застарілі значення (stale closure).',
      'useEffect — це синхронізація, а не дослівний аналог lifecycle-методів.',
    ],
  },
  {
    id: 'flow',
    title: 'Що таке Flow',
    description:
      'Flow — статичний типізатор для JavaScript від Facebook, альтернатива TypeScript. Додається через анотації типів і спеціальний коментар // @flow на початку файлу; типи перевіряються окремим інструментом, а потім стираються (через babel-plugin-transform-flow-strip-types), не потрапляючи в рантайм. Історично Flow широко використовувався у проєктах Facebook і в React (вихідний код React довго був на Flow). Концептуально схожий на TypeScript: типізація змінних, функцій, обʼєктів, дженерики, union тощо. Сьогодні Flow майже повністю програв конкуренцію TypeScript: екосистема, інструменти, типи бібліотек (DefinitelyTyped) і спільнота — на боці TS, тому в нових проєктах беруть TypeScript.',
    codeExamples: [
      {
        label: 'Синтаксис Flow',
        code: `// @flow
function square(n: number): number {
  return n * n;
}
type User = { id: number, name: string };
const u: User = { id: 1, name: "Ada" };`,
      },
      {
        label: 'Дуже схоже на TS',
        code: `// Flow (схоже на TypeScript)
type Maybe<T> = T | null;
const find = (arr: Array<number>): Maybe<number> => arr[0] ?? null;`,
      },
    ],
    gotchas: [
      'Flow і TypeScript розвʼязують ту саму задачу — обирайте TS для нового коду.',
      'Не плутати Flow (типізатор) з flux/потоком даних — це різні речі.',
      'Типи Flow стираються в рантаймі (як і в TS) — це не рантайм-перевірка.',
      'Екосистема типів бібліотек у Flow набагато бідніша за DefinitelyTyped.',
      'Зустрічається переважно в легасі-коді Facebook-екосистеми.',
    ],
  },
  {
    id: 'usestate-lazy-init',
    title: 'Другий аргумент useState (lazy initializer)',
    description:
      'Питання насправді про lazy-ініціалізацію useState. useState приймає початкове значення; якщо його обчислення дороге, можна передати не саме значення, а ФУНКЦІЮ, що його повертає — useState(() => heavyInit()). Тоді React викличе цю функцію лише ОДИН раз, при першому рендері (монтуванні), а не на кожному рендері. Без цього вираз initial обчислюється щоразу, навіть якщо результат відкидається (бо стан уже є). Це і є «lazy initial state». Окремо: setState теж приймає функцію-апдейтер (prev => next) — це інше застосування функції, для коректного оновлення на основі попереднього значення. Не плутати ці два «функціональні» аргументи.',
    codeExamples: [
      {
        label: 'Lazy initial state',
        code: `// ❌ readFromLocalStorage() викликається ЩОРЕНДУ (результат відкидається)
const [data, setData] = useState(readFromLocalStorage());

// ✅ функція-ініціалізатор виконується ЛИШЕ один раз
const [data2, setData2] = useState(() => readFromLocalStorage());`,
      },
      {
        label: 'Не плутати з функцією-апдейтером',
        code: `// апдейтер — для оновлення на основі попереднього стану:
setCount(prev => prev + 1); // безпечно при кількох оновленнях поспіль`,
      },
    ],
    gotchas: [
      'Передача результату (а не функції) обчислює initial щоренду, дарма витрачаючи ресурси.',
      'Lazy-ініціалізатор виконується лише один раз — побічні ефекти в ньому небажані.',
      'Не плутати ініціалізатор useState(() => x) із апдейтером setState(prev => ...).',
      'Апдейтер (prev => next) обовʼязковий при кількох оновленнях поспіль або в замиканнях.',
      'Початковий стан НЕ оновлюється при зміні props — useState бере його лише раз.',
    ],
  },
  {
    id: 'useeffect-vs-uselayouteffect',
    title: 'Різниця між useEffect і useLayoutEffect',
    description:
      'Обидва запускають побічний ефект після рендеру, але в різний момент. useEffect виконується АСИНХРОННО, ПІСЛЯ того як браузер перемалював екран — він не блокує промальовування, тому підходить для більшості ефектів (запити, підписки, логування). useLayoutEffect виконується СИНХРОННО, ПІСЛЯ змін DOM, але ДО перемальовування — браузер чекає його завершення перед тим, як показати кадр. Це потрібно, коли ефект змінює DOM (вимірює розмір/позицію й одразу коригує верстку), щоб користувач не побачив «миготіння» проміжного стану. Ціна — useLayoutEffect блокує промальовування, тож зловживання шкодить продуктивності. Правило: за замовчуванням useEffect; useLayoutEffect — лише коли треба зміряти/змінити DOM до показу.',
    codeExamples: [
      {
        label: 'useLayoutEffect проти миготіння',
        code: `function Tooltip() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    ref.current.style.top = -height + "px"; // коригуємо ДО показу
  }, []);
  return <div ref={ref}>підказка</div>;
}`,
      },
      {
        label: 'useEffect — для решти',
        code: `useEffect(() => {
  const sub = subscribe(onData); // не блокує рендер
  return () => sub.unsubscribe();
}, []);`,
      },
    ],
    gotchas: [
      'useLayoutEffect блокує промальовування — зловживання гальмує UI.',
      'useLayoutEffect не працює на сервері (SSR) і попереджає про це.',
      'useEffect виконується після показу кадру — для DOM-вимірювань може дати миготіння.',
      'За замовчуванням беріть useEffect; layout — лише для синхронної роботи з DOM до показу.',
      'Обидва мають cleanup; порядок: cleanup попереднього → новий ефект.',
    ],
  },
  {
    id: 'lifecycle-stages',
    title: 'Стадії життєвого циклу компонента',
    description:
      'Життєвий цикл компонента має три стадії. 1) Mounting (монтування) — компонент створюється й уперше вставляється в DOM: ініціалізація стану, перший рендер, доступ до DOM (componentDidMount / useEffect з []). Тут роблять початкові запити й підписки. 2) Updating (оновлення) — компонент перемальовується через зміну props, state чи context: повторний рендер і реакція на зміни (componentDidUpdate / useEffect з залежностями). 3) Unmounting (розмонтування) — компонент видаляється з DOM: очищення підписок, таймерів, слухачів (componentWillUnmount / cleanup-функція useEffect). Окремо стоїть обробка помилок (error boundaries). У функціональних компонентах усі три стадії покриваються useEffect із відповідним масивом залежностей і cleanup.',
    codeExamples: [
      {
        label: 'Три стадії у хуках',
        code: `function C({ id }) {
  useEffect(() => {              // MOUNT
    const sub = subscribe(id);
    return () => sub.cancel();   // UNMOUNT (cleanup)
  }, []);

  useEffect(() => {              // UPDATE (реакція на зміну id)
    refetch(id);
  }, [id]);

  return <div />;               // RENDER (кожна стадія)
}`,
      },
      {
        label: 'Класовий відповідник',
        code: `componentDidMount() {}    // mount
componentDidUpdate() {}   // update
componentWillUnmount() {} // unmount`,
      },
    ],
    gotchas: [
      'Забуте очищення на unmount → витоки памʼяті (таймери, підписки, слухачі).',
      'setState без умови в стадії оновлення → нескінченний цикл рендерів.',
      'WILL-методи (componentWillMount тощо) застарілі — не використовувати.',
      'У хуках мисліть синхронізацією, а не дослівними стадіями lifecycle.',
      'Конкурентний рендер може кілька разів «почати» рендер до коміту — рендер має бути чистим.',
    ],
  },
  {
    id: 'useref-values',
    title: 'Чи можна useRef для значень (не тільки DOM)',
    description:
      'Так. Окрім доступу до DOM, useRef широко використовують для зберігання будь-якого мутабельного значення, що має пережити рендери, але не повинно викликати ререндер при зміні. ref.current — це звичайна «комірка», яку можна читати й писати будь-коли. Типові кейси: id таймера/інтервалу, попереднє значення пропа чи стану (для порівняння), прапорець «це перший рендер», збереження останнього колбека, лічильник, що не впливає на UI, мутабельний кеш. Головна відмінність від state: запис у ref.current НЕ перемальовує компонент. Тому правило вибору таке: значення впливає на те, що видно? — це state; службове значення «за лаштунками»? — це ref. Писати/читати ref варто в ефектах і обробниках, а не під час рендеру.',
    codeExamples: [
      {
        label: 'Попереднє значення',
        code: `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current; // значення з попереднього рендеру
}`,
      },
      {
        label: 'Прапорець першого рендеру',
        code: `function C({ data }) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    onChange(data); // пропускаємо перший виклик
  }, [data]);
}`,
      },
    ],
    gotchas: [
      'Запис у ref.current НЕ викликає ререндер — для видимих даних потрібен state.',
      'Не читати/писати ref під час рендеру (нечистий рендер) — лише в ефектах/обробниках.',
      'Спроба тримати UI-стан у ref → екран не оновлюється.',
      'ref.current переживає рендери, але скидається при анмаунті компонента.',
      'usePrevious через ref оновлюється в ефекті — повертає значення попереднього рендеру.',
    ],
  },
  {
    id: 'synthetic-event',
    title: 'Synthetic event — навіщо й як працює',
    description:
      'SyntheticEvent — це обгортка React навколо нативної події браузера, що дає єдиний, крос-браузерно узгоджений інтерфейс (той самий API всюди). Коли ви пишете onClick={fn}, fn отримує не нативний event, а SyntheticEvent зі стандартними полями (target, preventDefault, stopPropagation) і доступом до нативної події через e.nativeEvent. Важлива деталь реалізації: React не вішає окремий слухач на кожен елемент — він використовує делегування подій, навішуючи слухачі на корінь застосунку (у React 17+ — на кореневий контейнер, до того — на document), і сам розподіляє події. Це ефективніше за памʼяттю. Раніше synthetic events «переюзались» (event pooling), і e треба було читати синхронно, але в React 17+ пулінг прибрали.',
    codeExamples: [
      {
        label: 'SyntheticEvent у обробнику',
        code: `function Button() {
  const handle = (e) => {       // e — SyntheticEvent
    e.preventDefault();
    e.stopPropagation();
    console.log(e.target, e.nativeEvent); // доступ до нативної події
  };
  return <button onClick={handle}>Click</button>;
}`,
      },
      {
        label: 'Делегування під капотом',
        code: `// React не вішає listener на КОЖНУ кнопку —
// один слухач на корені застосунку розподіляє всі події.
// Тому onClick працює однаково для тисяч елементів.`,
      },
    ],
    gotchas: [
      'React використовує делегування — слухач на корені, не на кожному елементі.',
      'З React 17 root для делегування — контейнер застосунку, а не document (важливо для кількох React-дерев).',
      'Event pooling прибрано в React 17+; e.persist() у новому коді не потрібен.',
      'stopPropagation у synthetic-події не завжди зупиняє нативні addEventListener-слухачі.',
      'e.nativeEvent дає доступ до справжньої події браузера за потреби.',
    ],
  },
  {
    id: 'pure-components',
    title: 'Pure Components',
    description:
      'PureComponent — це базовий клас (React.PureComponent), що автоматично реалізує shouldComponentUpdate з поверхневим (shallow) порівнянням props і state. Тобто компонент перемальовується лише тоді, коли поверхневе порівняння виявляє зміну — це готова оптимізація без ручного написання shouldComponentUpdate. Поверхневе порівняння означає: примітиви звіряються за значенням, а обʼєкти/масиви/функції — за посиланням. Тому якщо передати новий обʼєкт із тим самим вмістом, PureComponent усе одно ререндериться. Функціональний аналог — React.memo. PureComponent доречний для «листя» дерева, що часто отримує ті самі props. Антипатерн — використовувати його з пропсами, що щоразу нові (інлайн-обʼєкти, стрілки), бо тоді оптимізація не працює.',
    codeExamples: [
      {
        label: 'PureComponent',
        code: `class Row extends React.PureComponent {
  // shouldComponentUpdate з shallow-порівнянням — автоматично
  render() { return <li>{this.props.item.name}</li>; }
}`,
      },
      {
        label: 'Пастка нового посилання',
        code: `// ❌ новий обʼєкт style щоренду — PureComponent усе одно ререндериться
<Row item={item} style={{ color: "red" }} />

// ✅ стабільне посилання
const style = useMemo(() => ({ color: "red" }), []);`,
      },
    ],
    gotchas: [
      'Поверхневе порівняння: новий обʼєкт/масив/функція з тим самим вмістом усе одно тригерить ререндер.',
      'Інлайн-пропси (style={{}}, () => {}) зводять PureComponent нанівець.',
      'Мутація вкладеного обʼєкта не змінює посилання → PureComponent «не побачить» зміну.',
      'Не вмикати превентивно скрізь — оптимізуйте за профайлером.',
      'PureComponent — класи; React.memo — функції; та сама ідея, різний синтаксис.',
    ],
  },
  {
    id: 'react-memo',
    title: 'React.memo',
    description:
      'React.memo — це функція вищого порядку, що мемоізує функціональний компонент: React пропускає його ререндер, якщо props не змінилися (за поверхневим порівнянням). Це функціональний аналог PureComponent. За замовчуванням порівняння поверхневе (примітиви — за значенням, обʼєкти/функції — за посиланням), але можна передати власну функцію порівняння другим аргументом: (prevProps, nextProps) => boolean, де true означає «props рівні, ПРОПУСТИТИ ререндер». React.memo допомагає, коли компонент дорогий і часто отримує ті самі props, а його батько часто ререндериться. Важливо: memo не зупиняє ререндери від власного стану чи контексту — лише від незмінних props. Для ефективності пропси-обʼєкти/функції треба стабілізувати (useMemo/useCallback).',
    codeExamples: [
      {
        label: 'Базове використання',
        code: `const Item = React.memo(function Item({ name }) {
  return <li>{name}</li>;
});
// Item не ререндериться, якщо name (примітив) не змінився`,
      },
      {
        label: 'Кастомне порівняння + стабільні пропси',
        code: `const Row = React.memo(
  ({ user }) => <div>{user.name}</div>,
  (prev, next) => prev.user.id === next.user.id // true → пропустити
);
const onClick = useCallback(() => select(id), [id]); // стабільна функція`,
      },
    ],
    gotchas: [
      'Кастомний компаратор повертає true, щоб ПРОПУСТИТИ рендер (зворотно до shouldComponentUpdate).',
      'memo марний, якщо пропси — нові обʼєкти/функції щоренду (потрібні useMemo/useCallback).',
      'memo не зупиняє ререндери від власного стану чи зміни контексту.',
      'Поверхневе порівняння не бачить змін усередині вкладених структур.',
      'React Compiler (React 19) робить ручний memo дедалі менш потрібним.',
    ],
  },
  {
    id: 'reconciliation',
    title: 'Реконсиляція (Reconciliation)',
    description:
      'Reconciliation — це процес, яким React визначає, що саме змінити в реальному DOM при оновленні. Коли стан змінюється, React будує нове дерево елементів і порівнює (diffing) його з попереднім, обчислюючи мінімальний набір змін. Повне «чесне» порівняння двох дерев — надто дорога операція, тому React використовує кілька простих практичних правил (евристик): 1) елементи різного типу дають повну заміну піддерева (старе знищується, нове створюється з нуля); 2) елементи того самого типу — оновлюються лише змінені атрибути/пропси; 3) для списків дітей використовуються key — стабільні ідентифікатори, які кажуть React, який елемент є яким при додаванні/видаленні/перестановці. Сучасний рушій React (Fiber) дозволяє переривати й пріоритизувати цю роботу (конкурентний режим).',
    codeExamples: [
      {
        label: 'key для коректного diffing',
        code: `// ❌ key=index ламається при вставці/видаленні/сортуванні
{items.map((it, i) => <Row key={i} item={it} />)}

// ✅ стабільний унікальний key
{items.map((it) => <Row key={it.id} item={it} />)}`,
      },
      {
        label: 'Різний тип → повна заміна',
        code: `// перемикання типу знищує піддерево й створює нове:
{isEdit ? <input /> : <span />}
// стан і DOM <input> НЕ переносяться у <span>`,
      },
    ],
    gotchas: [
      'key=index ламає стан/DOM при вставці, видаленні чи перестановці елементів.',
      'Зміна типу елемента знищує піддерево й увесь його стан.',
      'key має бути стабільним і унікальним серед сусідів, не глобально.',
      'Reconciliation працює над елементами — це не пряме порівняння реального DOM.',
      'Той самий компонент на тій самій позиції зберігає стан — інколи це небажано (потрібен key для скидання).',
    ],
  },
  {
    id: 'usetransition',
    title: 'useTransition',
    description:
      'useTransition — хук React 18 для позначення оновлень стану як «перехідних» (transition), тобто неспішних і таких, що можна перервати. Повертає [isPending, startTransition]: isPending — прапорець, що перехід триває (можна показати індикатор), startTransition(fn) — обгортка, всередині якої оновлення стану позначаються як низькопріоритетні. Сенс: React тримає терміновими оновлення, що мають відчуватись миттєво (ввід у поле), а важкі наслідки (фільтрація великого списку за цим вводом) обробляє у фоні, не блокуючи інтерфейс. Якщо під час переходу прилітає нове термінове оновлення, React може кинути поточну фонову роботу й почати заново. Це частина конкурентного рендеру — дає плавність без ручного дебаунсу.',
    codeExamples: [
      {
        label: 'Терміновий ввід + фоновий список',
        code: `function Search() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const onChange = (e) => {
    setQuery(e.target.value);           // терміново — поле реагує миттєво
    startTransition(() => {
      setList(filterHugeList(e.target.value)); // фоново, можна перервати
    });
  };
  return <>{isPending && <Spinner />}{/* ... */}</>;
}`,
      },
    ],
    gotchas: [
      'У startTransition кладуть оновлення стану, а не сам async-запит/важке обчислення.',
      'Transition не пришвидшує роботу — лише знижує її пріоритет, щоб не блокувати UI.',
      'Це не заміна дебаунсу в усіх кейсах — для мережевих запитів часто потрібен і дебаунс.',
      'Доступний лише в конкурентному React (18+) із createRoot.',
      'isPending стосується фонового переходу, а не термінових оновлень.',
    ],
  },
  {
    id: 'batching',
    title: 'Що таке батчинг оновлень стану (batching)',
    description:
      'Батчинг — це обʼєднання кількох оновлень стану в один ререндер для ефективності. Якщо в одному обробнику ви викликаєте setState кілька разів, React не перемальовує компонент після кожного виклику, а збирає їх і робить один ререндер наприкінці. До React 18 батчинг працював лише всередині обробників подій React, а в асинхронному коді (проміси, setTimeout, нативні події) кожен setState давав окремий ререндер. У React 18 зʼявився automatic batching — оновлення батчаться скрізь, зокрема в промісах, таймерах і async-функціях. Якщо потрібно навмисно вийти з батчингу й застосувати оновлення синхронно, є flushSync. Через батчинг оновлення на основі попереднього значення варто робити через функцію-апдейтер.',
    codeExamples: [
      {
        label: 'Кілька setState → один ререндер',
        code: `function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  setName("Ada");
  // React зробить ОДИН ререндер, а не три
}`,
      },
      {
        label: 'Чому апдейтер, а не пряме значення',
        code: `// ❌ обидва бачать старий count → +1 лише один раз
setCount(count + 1); setCount(count + 1);
// ✅ апдейтер бачить актуальне → +2
setCount(c => c + 1); setCount(c => c + 1);`,
      },
    ],
    gotchas: [
      'Кілька setState із прямим значенням бачать той самий старий стан — потрібен апдейтер (prev => ...).',
      'До React 18 батчинг не діяв у промісах/setTimeout; з 18 — automatic batching скрізь.',
      'flushSync виходить з батчингу й шкодить продуктивності — лише за крайньої потреби.',
      'Стан не оновлюється «миттєво» після setState — нове значення доступне з наступного рендеру.',
      'Батчинг — причина, чому послідовні setState не дають проміжних ререндерів.',
    ],
  },
  {
    id: 'lazy-suspense',
    title: 'Що таке lazy і Suspense',
    description:
      'React.lazy — функція для динамічного імпорту компонента: він завантажиться окремим чанком лише тоді, коли знадобиться (code splitting), а не в основному бандлі. Suspense — компонент-обгортка, що показує fallback (наприклад, спінер), поки «призупинений» дочірній компонент завантажується чи чекає на дані. Разом вони дають лінивe завантаження частин застосунку: великі сторінки, важкі бібліотеки, маршрути вантажаться на вимогу, зменшуючи початковий розмір бандлу й час до інтерактивності. Suspense ловить «призупинення» і декларативно керує станом завантаження замість ручних прапорців isLoading. У React 18+ Suspense працює і для даних (з фреймворками й бібліотеками, що його підтримують), у React 19 — разом із новим хуком use.',
    codeExamples: [
      {
        label: 'lazy + Suspense',
        code: `const Dashboard = React.lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard /> {/* завантажиться окремим чанком на вимогу */}
    </Suspense>
  );
}`,
      },
      {
        label: 'Лінива маршрутизація',
        code: `const routes = {
  "/settings": React.lazy(() => import("./Settings")),
  "/profile": React.lazy(() => import("./Profile")),
}; // кожен маршрут — окремий бандл`,
      },
    ],
    gotchas: [
      'lazy-компонент мусить бути всередині Suspense, інакше — помилка.',
      'React.lazy працює з default-експортом — named треба обгортати.',
      'Збій завантаження чанку (мережа) треба ловити error boundary.',
      'Занадто дрібне розбиття на чанки дає багато запитів — балансуйте гранулярність.',
      'Suspense для даних повноцінно працює з підтримкою фреймворку/бібліотеки (React 18/19).',
    ],
  },
  {
    id: 'context-api',
    title: 'Що таке Context API',
    description:
      'Context API — вбудований механізм React для передачі даних через дерево компонентів без «прокидання пропсів» (prop drilling) через кожен проміжний рівень. Створюється через createContext(defaultValue); значення надається через <Context.Provider value={...}>, а споживається через useContext(Context) (або Context.Consumer у класах). Типові кейси: тема (світла/темна), поточний користувач/авторизація, мова (i18n), налаштування — тобто дані, потрібні багатьом компонентам на різній глибині. Важлива особливість продуктивності: будь-яка зміна value у Provider ререндерить УСІХ споживачів контексту. Тому Context добре пасує для рідко змінюваних глобальних даних, а для частих оновлень чи складного стану краще стейт-менеджер. У React 19 можна рендерити <Context> напряму як провайдер.',
    codeExamples: [
      {
        label: 'Створення й споживання',
        code: `const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
function Button() {
  const theme = useContext(ThemeContext); // без прокидання пропсів
  return <button className={theme}>Click</button>;
}`,
      },
      {
        label: 'Пастка нового value',
        code: `// ❌ новий обʼєкт value щоренду → усі споживачі ререндеряться
<Ctx.Provider value={{ user, setUser }}>
// ✅ стабілізуйте value
const value = useMemo(() => ({ user, setUser }), [user]);`,
      },
    ],
    gotchas: [
      'Зміна value ререндерить УСІХ споживачів — навіть тих, хто читає лише частину.',
      'Новий обʼєкт у value щоренду зводить нанівець оптимізації — стабілізуйте через useMemo.',
      'Context — не стейт-менеджер: немає селективних підписок, для частого стану беріть інше.',
      'Глибока вкладеність провайдерів («provider hell») ускладнює дерево.',
      'defaultValue використовується лише без Provider — часта причина «несподіваного» значення.',
    ],
  },
  {
    id: 'useimperativehandle',
    title: 'Що таке useImperativeHandle',
    description:
      'useImperativeHandle — хук, що дозволяє компоненту налаштувати, який саме обʼєкт буде доступний батьку через ref, замість того щоб віддавати весь DOM-вузол. Використовується разом із forwardRef (у React 19 — просто з ref як пропсом). Сигнатура: useImperativeHandle(ref, () => ({ методи }), [deps]). Так дочірній компонент відкриває батьку обмежений імперативний API — наприклад, focus(), scrollToTop(), play() — приховуючи внутрішню реалізацію. Це «аварійний вихід» для імперативної взаємодії, коли декларативного підходу (props/state) недостатньо. Застосовувати варто рідко: більшість задач у React розвʼязуються декларативно, а імперативний API ускладнює потік даних і робить компоненти важчими для розуміння.',
    codeExamples: [
      {
        label: 'Обмежений API замість DOM',
        code: `const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ""; },
  }), []);
  return <input ref={inputRef} {...props} />;
});`,
      },
      {
        label: 'Виклик з батька',
        code: `function Form() {
  const ref = useRef(null);
  return (
    <>
      <FancyInput ref={ref} />
      <button onClick={() => ref.current.focus()}>Фокус</button>
    </>
  );
}`,
      },
    ],
    gotchas: [
      'Потребує forwardRef (до React 19); у React 19 ref передається як звичайний проп.',
      'Імперативний API ускладнює потік даних — використовуйте лише за крайньої потреби.',
      'Масив залежностей важливий — без нього обʼєкт-handle може застаріти.',
      'Не відкривайте увесь DOM — лише потрібні методи (інкапсуляція).',
      'Більшість задач розвʼязуються декларативно (props/state), а не через ref.',
    ],
  },
  {
    id: 'usedeferredvalue',
    title: 'Що таке useDeferredValue',
    description:
      'useDeferredValue — хук React 18, що повертає «відкладену» версію значення: вона оновлюється з нижчим пріоритетом, відстаючи від актуальної при швидких змінах. const deferred = useDeferredValue(value): поки приходять часті оновлення (наприклад, швидкий ввід), deferred тримає попереднє значення, а React оновлює його у фоні, коли встигає, не блокуючи термінові оновлення. Це дозволяє показувати чуйний інтерфейс (поле реагує миттєво) і відкладати дорогі похідні рендери (важкий список, що залежить від цього значення). Концептуально схоже на useTransition, але застосовується, коли ви не контролюєте сам setState (значення приходить ззовні, як проп), і відкладаєте саме значення, а не оновлення стану.',
    codeExamples: [
      {
        label: 'Відкладений важкий список',
        code: `function Results({ query }) {
  const deferredQuery = useDeferredValue(query);
  // важкий список рендериться за відкладеним значенням
  const list = useMemo(
    () => <HugeList query={deferredQuery} />,
    [deferredQuery]
  );
  return list;
}`,
      },
      {
        label: 'Індикатор «застарілості»',
        code: `const deferred = useDeferredValue(query);
const isStale = deferred !== query; // показати приглушений стан, поки наздоганяє
return <div style={{ opacity: isStale ? 0.5 : 1 }}>{/* ... */}</div>;`,
      },
    ],
    gotchas: [
      'Дає виграш лише якщо дорогий рендер мемоізований (useMemo/React.memo) — інакше перерахунок щоразу.',
      'Не пришвидшує роботу — лише відкладає її з нижчим пріоритетом.',
      'Відрізняється від useTransition: тут відкладається значення, там — оновлення стану.',
      'Не заміна дебаунсу для мережевих запитів.',
      'Доступний лише в конкурентному React (18+).',
    ],
  },
  {
    id: 'effects-three',
    title: 'Різниця між useEffect, useLayoutEffect, useInsertionEffect',
    description:
      'Три хуки ефектів, що відрізняються моментом виконання. useInsertionEffect — виконується НАЙРАНІШЕ, до змін DOM-layout; призначений виключно для бібліотек CSS-in-JS, щоб вставити <style>-теги до того, як браузер почне обчислювати стилі (звичайному коду він не потрібен). useLayoutEffect — виконується після змін DOM, але ДО перемальовування екрана, синхронно; для вимірювання/коригування DOM без видимого миготіння. useEffect — виконується ПІСЛЯ перемальовування, асинхронно; дефолт для більшості ефектів (запити, підписки, логи), не блокує промальовування. Порядок у фазі коміту: useInsertionEffect → (мутації DOM) → useLayoutEffect → браузер малює → useEffect. Правило: майже завжди useEffect; useLayoutEffect — для DOM-вимірювань; useInsertionEffect — лише авторам CSS-in-JS.',
    codeExamples: [
      {
        label: 'Порядок виконання',
        code: `// 1) useInsertionEffect — вставка стилів (CSS-in-JS бібліотеки)
// 2) мутації DOM
// 3) useLayoutEffect — вимір/коригування DOM до показу
// 4) браузер малює кадр
// 5) useEffect — решта ефектів після показу`,
      },
      {
        label: 'Хто для чого',
        code: `useEffect(() => { subscribe(); }, []);          // дефолт
useLayoutEffect(() => { measureDom(); }, []);    // вимір до показу
useInsertionEffect(() => { injectStyle(); }, []); // лише CSS-in-JS`,
      },
    ],
    gotchas: [
      'useInsertionEffect — лише для CSS-in-JS; у ньому немає доступу до ref/DOM-layout.',
      'useLayoutEffect блокує промальовування — не для важких операцій.',
      'useLayoutEffect і useInsertionEffect не виконуються на сервері (SSR).',
      'Порядок фіксований: insertion → layout → (малювання) → effect.',
      'За замовчуванням завжди useEffect; решта — для вузьких випадків.',
    ],
  },
]
