import Multiselect from 'multiselect-react-dropdown';
import { useEffect } from 'react';
import { FunctionComponent, useCallback, useState } from 'react';
import { makeAutoObservable, action } from 'mobx';
import { observer } from 'mobx-react-lite';

const PIZZA_TOPPINGS = ['mushrooms', 'mozarella', 'bell pepper', 'pineapples'];
const SELECT_PIZZA_TOPPINGS = PIZZA_TOPPINGS.map((topping) => ({ name: topping, value: topping }));

interface Pizza {
  id: number;
  name: string;
  crust: 'thin' | 'thick';
  borders: 'plain' | 'cheeze' | 'sausage';
  isSomething: boolean;
  toppings: string[];
}

interface Pasta {
  id: number;
  name: string;
  shape: 'pasta' | 'fettuccine' | 'penne';
  base: 'tomato' | 'cream' | 'fat';
  toppings: string[];
}

const fetchPizza = (): Pizza[] => {
  return [
    {
      id: 1,
      name: 'Pepperoni',
      crust: 'thin',
      borders: 'plain',
      toppings: [],
      isSomething: false,
    },
    {
      id: 2,
      name: 'Meat',
      crust: 'thick',
      borders: 'sausage',
      toppings: [],
      isSomething: false,
    },
    {
      id: 3,
      name: 'Cheeze',
      crust: 'thin',
      borders: 'cheeze',
      toppings: [],
      isSomething: false,
    },
  ];
};

const fetchPasta = (): Pasta[] => {
  return [
    { id: 1, name: 'Carbonara', shape: 'pasta', base: 'fat', toppings: [] },
    { id: 2, name: 'Alfredo', shape: 'fettuccine', base: 'cream', toppings: [] },
    { id: 3, name: 'Puttanesca', shape: 'pasta', base: 'tomato', toppings: [] },
  ];
};

class PizzaStore {
  pizzas: Pizza[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setPizzas(pizzas: Pizza[]) {
    this.pizzas = pizzas;
  }
}

const pizzaStore = new PizzaStore();

export const PizzaContainer: FunctionComponent = observer(() => {
  console.log('PizzaContainer');
  //   useEffect(() => {
  //     action(() => {
  //       console.log('useEffect');
  //       pizzaStore.pizzas = fetchPizza();
  //     })();
  //   }, []);
  //   action(() => {
  //     pizzaStore.pizzas = fetchPizza();
  //   })
  //   useEffect(action(() => {
  //     pizzaStore.pizzas = fetchPizza();
  //   }) []);
  const [pizzas, setPizzas] = useState<Pizza[]>(() => fetchPizza());

  const handleUpdatePizza = useCallback((id: number, update: Partial<Pizza>) => {
    setPizzas((pizzas) => {
      const idx = pizzas.findIndex((pizza) => pizza.id === id);
      pizzas[idx] = { ...pizzas[idx], ...update };
      console.log('pizzas', pizzas);
      return [...pizzas];
    });
  }, []);

  //   const handleUpdatePizza = useCallback(
  //     action((id: number, update: Partial<Pizza>) => {
  //       const idx = pizzaStore.pizzas.findIndex((pizza) => pizza.id === id);
  //       pizzaStore.pizzas[idx] = { ...pizzaStore.pizzas[idx], ...update };
  //       // setPizzas((pizzas) => {
  //       //   const idx = pizzas.findIndex((pizza) => pizza.id === id);
  //       //   pizzas[idx] = { ...pizzas[idx], ...update };
  //       //   console.log('pizzas', pizzas);
  //       //   return pizzas;
  //       // });
  //     }),
  //     [],
  //   );

  return <PizzaList pizzas={pizzas} onUpdatePizza={handleUpdatePizza} />;
});

const PizzaList: FunctionComponent<{
  pizzas: Pizza[];
  onUpdatePizza: (id: number, update: Partial<Pizza>) => void;
}> = observer(({ pizzas, onUpdatePizza }) => {
  console.log('PizzaList');
  return (
    <>
      <PizzaHeader title="Check out our pizza!" />
      {pizzas.map((pizza) => (
        <PizzaItem key={pizza.id} pizza={pizza} onUpdatePizza={onUpdatePizza} />
      ))}
    </>
  );
});

const PizzaItem: FunctionComponent<{
  pizza: Pizza;
  onUpdatePizza: (id: number, update: Partial<Pizza>) => void;
}> = observer(({ pizza, onUpdatePizza }) => {
  console.log('PizzaItem', pizza);
  const [currentPizza, setCurrentPizza] = useState(pizza);

  useEffect(() => console.log('PizzaItem init'), []);

  useEffect(() => {
    console.log('PizzaItem pizza update');
    setCurrentPizza(pizza);
  }, [pizza]);

  const handleSelectTopping = useCallback(
    (_: string, item: any) => {
      const toppings = pizza.toppings;
      toppings.push(item.value);
      const uniqueToppings = [...new Set(toppings)];
      // here I pretend that onUpdatePizza might take some time so I implement "optimistic" update
      setCurrentPizza((pizza) => ({ ...pizza, toppings: uniqueToppings }));
      onUpdatePizza(pizza.id, { toppings: uniqueToppings });
    },
    [pizza.id, pizza.toppings, onUpdatePizza],
  );

  const handleRemoveTopping = useCallback(
    (_: string, item: any) => {
      const toppings = pizza.toppings;
      const index = toppings.indexOf(item.value);
      if (index !== -1) {
        toppings.splice(index, 1);
      }
      // here I pretend that onUpdatePizza might take some time so I implement "optimistic" update
      setCurrentPizza((pizza) => ({ ...pizza, toppings }));
      onUpdatePizza(pizza.id, { toppings });
    },
    [pizza.id, pizza.toppings, onUpdatePizza],
  );

  // here I just send update of root state, to check how will it behave when state is updated from above
  const handleClick = useCallback(
    () => onUpdatePizza(pizza.id, { isSomething: !pizza.isSomething }),
    [pizza.id, pizza.isSomething, onUpdatePizza],
  );

  return (
    <div>
      {pizza.name}
      <Multiselect
        options={SELECT_PIZZA_TOPPINGS}
        selectedValues={currentPizza.toppings.map((topping) => ({
          name: topping,
          value: topping,
        }))}
        onSelect={handleSelectTopping}
        onRemove={handleRemoveTopping}
        displayValue="name"
      />
      <button onClick={handleClick}>{pizza.isSomething ? 'true' : 'false'}</button>
    </div>
  );
});

const PizzaHeader: FunctionComponent<{ title: string }> = ({ title }) => {
  console.log('PizzaHeader');
  return <div>Header: {title}</div>;
};

export const PastaContainer: FunctionComponent = () => {
  console.log('PastaContainer');
  return <div>bar</div>;
};
