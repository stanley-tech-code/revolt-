export const kenyaGeoData = {
  "Nairobi": {
    "Westlands": ["Parklands", "Karura", "Kangemi", "Mountain View", "Kitisuru"],
    "Dagoretti North": ["Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"],
    "Dagoretti South": ["Mutu-ini", "Ngando", "Riruta", "Uthiru", "Waithaka"],
    "Lang'ata": ["Karen", "Nairobi West", "Mugumo-ini", "South C", "Nyayo Highrise"],
    "Kibra": ["Laini Saba", "Lindi", "Makina", "Woodley", "Sarang'ombe"],
    "Roysambu": ["Roysambu", "Garden Estate", "Muthaiga", "Kahawa West", "Zimmerman", "Kahawa"],
    "Kasarani": ["Clay City", "Mwiki", "Kasarani", "Njiru", "Ruai"],
    "Ruaraka": ["Babadogo", "Utalii", "Mathare North", "Lucky Summer", "Korogocho"],
    "Embakasi South": ["Imara Daima", "Kwa Reuben", "Pipline", "Kware", "Kwa Njenga"],
    "Embakasi North": ["Kariobangi North", "Dandora Area I", "Dandora Area II", "Dandora Area III", "Dandora Area IV"],
    "Embakasi Central": ["Kayole North", "Kayole South", "Komarock", "Matopeni"],
    "Embakasi East": ["Upper Savanna", "Lower Savanna", "Embaksi", "Utawala", "Mihang'o"],
    "Embakasi West": ["Umoja I", "Umoja II", "Mowlem", "Kariobangi South"],
    "Makadara": ["Makongeni", "Maringo/Hamza", "Harambee", "Viwandani"],
    "Kamukunji": ["Pumwani", "Eastleigh North", "Eastleigh South", "Airbase", "California"],
    "Starehe": ["Nairobi Central", "Ngara", "Pangani", "Ziwani", "Landimawe", "Nairobi South"],
    "Mathare": ["Hospital", "Mabatini", "Huruma", "Ngei", "Mlango Kubwa", "Kiamaiko"]
  },
  "Mombasa": {
    "Mvita": ["Mji wa Kale/Makadara", "Tudor", "Tononoka", "Shimanzi/Ganjoni", "Majengo"],
    "Jomvu": ["Jomvu Kuu", "Mikindani", "Miritini"],
    "Changamwe": ["Port Reitz", "Kipevu", "Airport", "Changamwe", "Chaani"],
    "Kisauni": ["Mjambere", "Junda", "Bamburi", "Mwakirunge", "Mtopanga", "Magogoni", "Shanzu"],
    "Nyali": ["Frere Town", "Ziwa La Ng'ombe", "Mkomani", "Kongowea", "Kadzandani"],
    "Likoni": ["Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani"]
  },
  "Kiambu": {
    "Kiambu Town": ["Ting'ang'a", "Ndumberi", "Riabai", "Township"],
    "Kiambaa": ["Cianda", "Karuri", "Ndenderu", "Muchatha", "Kihara"],
    "Ruiru": ["Gitothua", "Biashara", "Gatongora", "Kahawa Sukari", "Kahawa Wendani", "Kiuu", "Mwiki", "Mwihoko"],
    "Kikuyu": ["Karai", "Nachu", "Sigona", "Kikuyu", "Kinoo"],
    "Limuru": ["Bibirioni", "Limuru Central", "Ndeiya", "Limuru East", "Ngecha Tigoni"],
    "Thika Town": ["Township", "Kamenu", "Hospital", "Gatuanyaga", "Ngoliba"],
    "Juja": ["Murera", "Theta", "Juja", "Witeithie", "Kalimoni"]
  },
  "Nakuru": {
    "Nakuru Town East": ["Biashara", "Kivumbini", "Flamingo", "Menengai", "Nakuru East"],
    "Nakuru Town West": ["Barut", "London", "Kaptembwa", "Kapkures", "Rhoda", "Shaabab"],
    "Naivasha": ["Biashara", "Hells Gate", "Lake View", "Mai Mahiu", "Maeilla", "Olkaria", "Naivasha East", "Viwandani"]
  },
  "Kisumu": {
    "Kisumu Central": ["Railways", "Migosi", "Shaurimoyo Kaloleni", "Market Milimani", "Kondele", "Nyalenda B"],
    "Kisumu East": ["Kajulu", "Kolwa East", "Manyatta B", "Nyalenda A", "Kolwa Central"],
    "Kisumu West": ["South West Kisumu", "Central Kisumu", "Kisumu North", "West Kisumu", "North West Kisumu"]
  },
  "Machakos": {
    "Machakos Town": ["Kalama", "Mua", "Mutituni", "Machakos Central", "Mumbuni North", "Muvuti", "Kola"],
    "Athi River": ["Athi River", "Kinanie", "Muthwani", "Syokimau/Mlolongo"]
  },
  "Uasin Gishu": {
    "Eldoret": ["Kapkures", "Kipsomba", "Kaptagat", "Kapsoya", "Kimumu"],
    "Kapseret": ["Simat/Kapseret", "Kipkenyo", "Ngeria", "Megun", "Langas"]
  }
};

const otherCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", 
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kilifi", "Kirinyaga", 
  "Kisii", "Kitui", "Kwale", "Laikipia", "Lamu", "Makueni", "Mandera", "Marsabit", 
  "Meru", "Migori", "Murang'a", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", 
  "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", 
  "Turkana", "Vihiga", "Wajir", "West Pokot"
];

otherCounties.forEach(county => {
  kenyaGeoData[county] = {
    "Other/Unlisted": ["Other/Unlisted"]
  };
});
