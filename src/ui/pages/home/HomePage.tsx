import { SingleSelectPicker } from "~/ui/widgets/form/PickerInput";

class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

}

const cities = [
  new City(1, "New York"),
  new City(2, "Los Angeles"),
  new City(3, "Chicago"),
  new City(4, "Houston"),
  new City(5, "Phoenix"),
];


export default function HomePage() {


  return (<div>
    <SingleSelectPicker<City>
      items={cities}
      searchOptions={{
        enabled: true,
      }}
      getKey={(c) => c.id}
      getLabel={(c) => c.name}
    />
  </div>);

}