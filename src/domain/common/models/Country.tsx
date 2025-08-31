export interface CountryMetadata {
  hasCity?: boolean;
  cityLabel?: string;
  cityLabelPlural?: string;
  hasPostalCode?: boolean;
  postalCodeLabel?: string;
  hasSubdivision?: boolean;
  subdivisionLabel?: string;
  subdivisionLabelPlural?: string;
  subdivisionInputType?: string;
  [key: string]: any;
}

export type CountryProps = {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  defaultCurrencyCode: string;
  metadata?: CountryMetadata;
}

export class Country {
  readonly id: number;
  readonly name: string;
  readonly iso2: string;
  readonly iso3: string;
  readonly defaultCurrencyCode: string;
  readonly metadata?: CountryMetadata;

  constructor(props: CountryProps) {
    this.id = props.id;
    this.name = props.name;
    this.iso2 = props.iso2;
    this.iso3 = props.iso3;
    this.defaultCurrencyCode = props.defaultCurrencyCode;
    this.metadata = props.metadata;
  }

  static fromJson(json: any): Country {
    return new Country({
      id: json.id,
      name: json.name,
      iso2: json.iso2,
      iso3: json.iso3,
      defaultCurrencyCode: json.defaultCurrencyCode,
      metadata: json.metadata
    });
  }
}
