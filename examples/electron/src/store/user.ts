import { action, observable } from "mobx";
import { message$ } from "./message";

class UserStore {
  @observable
  userInfo = {
    name: "mobx-devtool",
    age: 18,
    isOnline: false,
    friends: [
      {
        name: "Zia Mack",
        phone: "(254) 474-3128",
        email: "magna.sed.eu@yahoo.ca",
        address: "383-8321 Ligula. Road",
        list: 3,
        country: "Chile",
        region: "Basilicata",
        postalZip: "17956",
        text: "elit, a feugiat tellus lorem eu metus. In lorem. Donec",
        numberrange: 5,
        currency: "$9.74",
        alphanumeric: "EWJ69VQG3FO",
      },
      {
        name: "Dylan Bradford",
        phone: "(633) 141-1239",
        email: "malesuada.malesuada.integer@outlook.org",
        address: "713-4095 Sed Ave",
        list: 19,
        country: "Germany",
        region: "South Chungcheong",
        postalZip: "2918",
        text: "euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut,",
        numberrange: 3,
        currency: "$19.02",
        alphanumeric: "MPU30YCR6BD",
      },
      {
        name: "Channing Gibbs",
        phone: "1-228-730-1211",
        email: "sit.amet@hotmail.couk",
        address: "167-4843 Magna. Street",
        list: 1,
        country: "Peru",
        region: "Bahia",
        postalZip: "4725-3371",
        text: "Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit,",
        numberrange: 3,
        currency: "$43.48",
        alphanumeric: "HNT01FSI3BE",
      },
      {
        name: "Jason Frazier",
        phone: "1-175-967-0644",
        email: "a@outlook.net",
        address: "Ap #931-5345 Diam Street",
        list: 5,
        country: "Mexico",
        region: "Ulster",
        postalZip: "30086",
        text: "ultricies ornare, elit elit fermentum risus, at fringilla purus mauris",
        numberrange: 3,
        currency: "$16.91",
        alphanumeric: "NKO12DXG2ED",
      },
      {
        name: "Harriet Bolton",
        phone: "(668) 131-8264",
        email: "duis.at@google.org",
        address: "721-311 At Road",
        list: 5,
        country: "Germany",
        region: "Rio de Janeiro",
        postalZip: "770075",
        text: "Donec non justo. Proin non massa non ante bibendum ullamcorper.",
        numberrange: 2,
        currency: "$5.74",
        alphanumeric: "UBC96ZLF7LF",
      },
      {
        name: "Maisie Jefferson",
        phone: "1-713-509-9023",
        email: "ultrices@outlook.couk",
        address: "330-3021 Arcu. Rd.",
        list: 17,
        country: "Costa Rica",
        region: "Huádōng",
        postalZip: "04152",
        text: "lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies",
        numberrange: 3,
        currency: "$88.70",
        alphanumeric: "RLT56REK9NJ",
      },
      {
        name: "Fletcher Tyson",
        phone: "1-915-250-3214",
        email: "malesuada.fames.ac@outlook.couk",
        address: "Ap #400-9679 Metus. Av.",
        list: 3,
        country: "Nigeria",
        region: "Wielkopolskie",
        postalZip: "67368",
        text: "tortor nibh sit amet orci. Ut sagittis lobortis mauris. Suspendisse",
        numberrange: 4,
        currency: "$32.17",
        alphanumeric: "VMX83TWY1DK",
      },
      {
        name: "Clio Tucker",
        phone: "(909) 524-7881",
        email: "dolor@icloud.net",
        address: "675-3786 Arcu. St.",
        list: 7,
        country: "Costa Rica",
        region: "North-East Region",
        postalZip: "15541",
        text: "ornare. Fusce mollis. Duis sit amet diam eu dolor egestas",
        numberrange: 6,
        currency: "$14.68",
        alphanumeric: "LMR83XFT7QE",
      },
      {
        name: "Martha Gray",
        phone: "1-626-837-0065",
        email: "nisi@yahoo.org",
        address: "375-7579 Nec Road",
        list: 1,
        country: "Turkey",
        region: "Southwestern Tagalog Region",
        postalZip: "3522",
        text: "euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate",
        numberrange: 9,
        currency: "$13.24",
        alphanumeric: "TVJ61URA5HZ",
      },
      {
        name: "Cameron Campos",
        phone: "(493) 868-5714",
        email: "id.sapien.cras@protonmail.ca",
        address: "798-7702 Aenean Road",
        list: 7,
        country: "Chile",
        region: "Kaliningrad Oblast",
        postalZip: "391381",
        text: "mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin",
        numberrange: 8,
        currency: "$85.78",
        alphanumeric: "IQL76FMH6MT",
      },
      {
        name: "Karyn Poole",
        phone: "(234) 970-2819",
        email: "blandit.congue.in@protonmail.edu",
        address: "581-7450 Vel Rd.",
        list: 5,
        country: "China",
        region: "Kogi",
        postalZip: "6654",
        text: "vel, mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit",
        numberrange: 8,
        currency: "$61.79",
        alphanumeric: "XXT74LEZ8ZC",
      },
      {
        name: "Lenore Duncan",
        phone: "(213) 835-7362",
        email: "sollicitudin@aol.org",
        address: "645-1296 Justo. St.",
        list: 5,
        country: "New Zealand",
        region: "Tarapacá",
        postalZip: "96593",
        text: "Fusce fermentum fermentum arcu. Vestibulum ante ipsum primis in faucibus",
        numberrange: 5,
        currency: "$19.10",
        alphanumeric: "TLK92ZFI1XH",
      },
      {
        name: "Myles Collins",
        phone: "1-286-373-5101",
        email: "per.inceptos@protonmail.com",
        address: "Ap #829-5712 Fermentum St.",
        list: 13,
        country: "Ireland",
        region: "Kahramanmaraş",
        postalZip: "4414",
        text: "molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare,",
        numberrange: 1,
        currency: "$43.02",
        alphanumeric: "CLY27UKO9QQ",
      },
      {
        name: "Hoyt Velazquez",
        phone: "(826) 868-7005",
        email: "aliquet.odio@aol.ca",
        address: "Ap #693-4319 Tincidunt Ave",
        list: 3,
        country: "Spain",
        region: "Jharkhand",
        postalZip: "XF5Q 9KP",
        text: "luctus lobortis. Class aptent taciti sociosqu ad litora torquent per",
        numberrange: 2,
        currency: "$67.28",
        alphanumeric: "GWS84WBC6GQ",
      },
      {
        name: "Wyoming Montoya",
        phone: "1-863-987-2571",
        email: "montes.nascetur.ridiculus@yahoo.com",
        address: "1432 Donec Av.",
        list: 11,
        country: "India",
        region: "Languedoc-Roussillon",
        postalZip: "681506",
        text: "placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet,",
        numberrange: 6,
        currency: "$68.09",
        alphanumeric: "WLH01CJI7SE",
      },
      {
        name: "Stacy Espinoza",
        phone: "(882) 253-8523",
        email: "mauris.ipsum.porta@google.edu",
        address: "7920 Lobortis. Av.",
        list: 9,
        country: "South Africa",
        region: "Cartago",
        postalZip: "46148-751",
        text: "at arcu. Vestibulum ante ipsum primis in faucibus orci luctus",
        numberrange: 5,
        currency: "$66.26",
        alphanumeric: "EZT24USR4XL",
      },
      {
        name: "Josephine Johnston",
        phone: "(703) 666-7731",
        email: "mauris.non@protonmail.org",
        address: "Ap #730-8003 Nec Ave",
        list: 13,
        country: "Sweden",
        region: "Connacht",
        postalZip: "811873",
        text: "metus facilisis lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec",
        numberrange: 1,
        currency: "$94.82",
        alphanumeric: "QIO56SSB3DG",
      },
      {
        name: "Imelda Massey",
        phone: "(733) 154-6635",
        email: "magna.ut@outlook.edu",
        address: "Ap #203-2692 Donec Road",
        list: 1,
        country: "South Korea",
        region: "Delta",
        postalZip: "4642",
        text: "amet ante. Vivamus non lorem vitae odio sagittis semper. Nam",
        numberrange: 1,
        currency: "$50.44",
        alphanumeric: "RSS42ALD9FN",
      },
      {
        name: "Cora Armstrong",
        phone: "(824) 333-1324",
        email: "donec@aol.com",
        address: "9022 Ridiculus Ave",
        list: 9,
        country: "Sweden",
        region: "Luik",
        postalZip: "488663",
        text: "rhoncus. Nullam velit dui, semper et, lacinia vitae, sodales at,",
        numberrange: 4,
        currency: "$95.75",
        alphanumeric: "SOQ10GJG5VS",
      },
      {
        name: "Guy Harrington",
        phone: "1-971-327-5748",
        email: "enim@aol.couk",
        address: "528-2952 Ultrices. Av.",
        list: 19,
        country: "Vietnam",
        region: "Nova Scotia",
        postalZip: "6215",
        text: "nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse",
        numberrange: 6,
        currency: "$23.05",
        alphanumeric: "RDD14CCR2IH",
      },
      {
        name: "Stone Rollins",
        phone: "1-815-722-9296",
        email: "scelerisque.dui@outlook.com",
        address: "528-6606 Ac Street",
        list: 19,
        country: "Ireland",
        region: "North Chungcheong",
        postalZip: "6137 OC",
        text: "enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare",
        numberrange: 3,
        currency: "$99.29",
        alphanumeric: "DGF00IFD5RO",
      },
      {
        name: "Deanna Mcleod",
        phone: "1-316-758-8904",
        email: "magna.nec.quam@hotmail.ca",
        address: "Ap #294-4751 Lacinia. St.",
        list: 15,
        country: "Russian Federation",
        region: "Huáběi",
        postalZip: "4724",
        text: "sem semper erat, in consectetuer ipsum nunc id enim. Curabitur",
        numberrange: 4,
        currency: "$80.37",
        alphanumeric: "FMG43EHX4GK",
      },
      {
        name: "Nola Mathis",
        phone: "(369) 410-2243",
        email: "maecenas.malesuada@icloud.edu",
        address: "Ap #411-2730 Hendrerit Street",
        list: 15,
        country: "Russian Federation",
        region: "Kansas",
        postalZip: "4815",
        text: "ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor",
        numberrange: 8,
        currency: "$57.75",
        alphanumeric: "LVU36IVY4RQ",
      },
      {
        name: "Sacha Nixon",
        phone: "1-624-247-3994",
        email: "nisl.quisque@aol.edu",
        address: "Ap #814-7939 Pretium Road",
        list: 11,
        country: "Turkey",
        region: "Magdalena",
        postalZip: "11801",
        text: "Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit.",
        numberrange: 6,
        currency: "$14.44",
        alphanumeric: "KYU28IUW4SD",
      },
      {
        name: "Nathan Waters",
        phone: "1-738-429-9627",
        email: "donec.est@icloud.ca",
        address: "Ap #869-9428 Interdum St.",
        list: 11,
        country: "Ukraine",
        region: "An Giang",
        postalZip: "T7V 3T6",
        text: "vel arcu eu odio tristique pharetra. Quisque ac libero nec",
        numberrange: 10,
        currency: "$58.59",
        alphanumeric: "SLN99KWG9LX",
      },
      {
        name: "Cruz Whitaker",
        phone: "(848) 741-7383",
        email: "eu.accumsan@yahoo.net",
        address: "Ap #365-3250 Tortor, Rd.",
        list: 17,
        country: "India",
        region: "Tolima",
        postalZip: "73792",
        text: "commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa",
        numberrange: 8,
        currency: "$83.92",
        alphanumeric: "QBH42XCR8YY",
      },
      {
        name: "Katell Boyd",
        phone: "1-525-696-0483",
        email: "natoque.penatibus@icloud.couk",
        address: "2493 Sit Avenue",
        list: 15,
        country: "Vietnam",
        region: "Lorraine",
        postalZip: "89601-737",
        text: "Fusce aliquet magna a neque. Nullam ut nisi a odio",
        numberrange: 7,
        currency: "$56.34",
        alphanumeric: "DUP72LEJ5TR",
      },
      {
        name: "Colt Buckner",
        phone: "(245) 487-5101",
        email: "ante.dictum.cursus@yahoo.ca",
        address: "795-3595 Mauris Street",
        list: 11,
        country: "South Korea",
        region: "Euskadi",
        postalZip: "725324",
        text: "Praesent interdum ligula eu enim. Etiam imperdiet dictum magna. Ut",
        numberrange: 6,
        currency: "$5.51",
        alphanumeric: "CWX47XXB1RR",
      },
      {
        name: "Francesca Acevedo",
        phone: "(661) 544-6378",
        email: "dictum.proin@protonmail.edu",
        address: "P.O. Box 357, 2524 Ac Ave",
        list: 19,
        country: "Peru",
        region: "Victoria",
        postalZip: "4617 FF",
        text: "magna sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem",
        numberrange: 2,
        currency: "$88.83",
        alphanumeric: "NXM48JGV2IL",
      },
      {
        name: "Megan Huber",
        phone: "1-351-718-0385",
        email: "aliquam.adipiscing@google.couk",
        address: "Ap #952-2939 Quisque Ave",
        list: 17,
        country: "Ukraine",
        region: "Special Capital Region of Jakarta",
        postalZip: "45795-68721",
        text: "elit, pretium et, rutrum non, hendrerit id, ante. Nunc mauris",
        numberrange: 5,
        currency: "$86.56",
        alphanumeric: "EHO26MLD3IF",
      },
    ],
  };

  @observable
  isBaby = false;

  @observable
  message = message$;

  @observable
  friendList = [];

  @action
  func1 = async () => {
    return null;
  };

  @action
  func2 = async () => {
    return false;
  };
}

export const user$ = new UserStore();
