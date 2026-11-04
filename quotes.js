// Цитати дня: мовою оригіналу, з підписом, звідки фраза.
// Свої улюблені можна додати прямо в додатку (кнопка «+» біля цитати).
window.QUOTES = [
  // Arcane
  { q: "Jinx... you're perfect.", who: "Silco", src: "Arcane" },
  { q: "Hey, cupcake.", who: "Vi to Caitlyn", src: "Arcane" },
  { q: "You're a jinx!", who: "Mylo", src: "Arcane" },

  // House M.D.
  { q: "Everybody lies.", who: "Dr. Gregory House", src: "House M.D." },
  { q: "It's never lupus.", who: "Dr. Gregory House", src: "House M.D." },
  { q: "Humanity is overrated.", who: "Dr. Gregory House", src: "House M.D." },
  { q: "If you talk to God, you're religious. If God talks to you, you're psychotic.", who: "Dr. Gregory House", src: "House M.D." },
  { q: "I don't ask why patients lie, I just assume they all do.", who: "Dr. Gregory House", src: "House M.D." },

  // Supernatural
  { q: "Saving people, hunting things. The family business.", who: "Dean Winchester", src: "Supernatural" },
  { q: "Family don't end with blood.", who: "Bobby Singer", src: "Supernatural" },
  { q: "Idjits.", who: "Bobby Singer", src: "Supernatural" },
  { q: "Driver picks the music, shotgun shuts his cakehole.", who: "Dean Winchester", src: "Supernatural" },
  { q: "Hello, Dean.", who: "Castiel", src: "Supernatural" },

  // Lucifer
  { q: "Tell me, what is it you truly desire?", who: "Lucifer Morningstar", src: "Lucifer" },
  { q: "I never lie.", who: "Lucifer Morningstar", src: "Lucifer" },
  { q: "Hello, Detective.", who: "Lucifer Morningstar", src: "Lucifer" },

  // Wednesday
  { q: "I act as if I don't care if people dislike me. Deep down, I secretly enjoy it.", who: "Wednesday Addams", src: "Wednesday" },
  { q: "I find social media to be a soul-sucking void of meaningless affirmation.", who: "Wednesday Addams", src: "Wednesday" },

  // American Horror Story
  { q: "Normal people scare me.", who: "Tate Langdon", src: "American Horror Story: Murder House" },
  { q: "Surprise, bitch. I bet you thought you'd seen the last of me.", who: "Madison Montgomery", src: "American Horror Story: Coven" },
  { q: "Balenciaga!", who: "Myrtle Snow", src: "American Horror Story: Coven" },

  // Avatar: The Last Airbender
  { q: "Pride is not the opposite of shame, but its source.", who: "Uncle Iroh", src: "Avatar: The Last Airbender" },
  { q: "Sharing tea with a fascinating stranger is one of life's true delights.", who: "Uncle Iroh", src: "Avatar: The Last Airbender" },
  { q: "Sometimes life is like this dark tunnel. You can't always see the light at the end of the tunnel, but if you just keep moving, you will come to a better place.", who: "Uncle Iroh", src: "Avatar: The Last Airbender" },
  { q: "My cabbages!", who: "Cabbage Merchant", src: "Avatar: The Last Airbender" },
  { q: "That's rough, buddy.", who: "Zuko", src: "Avatar: The Last Airbender" },
  { q: "I'm the greatest earthbender in the world!", who: "Toph Beifong", src: "Avatar: The Last Airbender" },

  // The Legend of Korra
  { q: "I'm the Avatar, you gotta deal with it!", who: "Korra", src: "The Legend of Korra" },
  { q: "When we hit our lowest point, we are open to the greatest change.", who: "Aang", src: "The Legend of Korra" },

  // The Boys
  { q: "Diabolical.", who: "Billy Butcher", src: "The Boys" },
  { q: "I'm stronger. I'm better. I can do whatever I want.", who: "Homelander", src: "The Boys" },

  // Marilyn Monroe
  { q: "I don't mind living in a man's world as long as I can be a woman in it.", who: "Marilyn Monroe", src: "Marilyn Monroe" },
  { q: "I can be smart when it's important, but most men don't like it.", who: "Lorelei Lee", src: "Gentlemen Prefer Blondes" },
  { q: "Men aren't attentive to girls who wear glasses.", who: "Pola Debevoise", src: "How to Marry a Millionaire" },
  { q: "Well, nobody's perfect.", who: "Osgood Fielding III", src: "Some Like It Hot" },

  // The Devil Wears Prada
  { q: "Florals? For spring? Groundbreaking.", who: "Miranda Priestly", src: "The Devil Wears Prada" },
  { q: "That's all.", who: "Miranda Priestly", src: "The Devil Wears Prada" },
  { q: "By all means, move at a glacial pace. You know how that thrills me.", who: "Miranda Priestly", src: "The Devil Wears Prada" },
  { q: "Details of your incompetence do not interest me.", who: "Miranda Priestly", src: "The Devil Wears Prada" },

  // Rush Hour
  { q: "Do you understand the words that are comin' out of my mouth?", who: "Detective Carter", src: "Rush Hour" },

  // Zootopia
  { q: "It's called a hustle, sweetheart.", who: "Nick Wilde", src: "Zootopia" },
  { q: "Anyone can be anything.", who: "Judy Hopps", src: "Zootopia" },
  { q: "You know you love me.", who: "Judy Hopps", src: "Zootopia" },

  // Spider-Verse
  { q: "Anyone can wear the mask.", who: "Miles Morales", src: "Spider-Man: Into the Spider-Verse" },
  { q: "That's all it is, Miles. A leap of faith.", who: "Peter B. Parker", src: "Spider-Man: Into the Spider-Verse" },
  { q: "Everyone keeps telling me how my story is supposed to go. Nah. I'mma do my own thing.", who: "Miles Morales", src: "Spider-Man: Across the Spider-Verse" },

  // Mean Girls
  { q: "On Wednesdays we wear pink.", who: "Karen Smith", src: "Mean Girls" },
  { q: "Get in, loser. We're going shopping.", who: "Regina George", src: "Mean Girls" },
  { q: "Stop trying to make fetch happen.", who: "Regina George", src: "Mean Girls" },
  { q: "She doesn't even go here!", who: "Damian", src: "Mean Girls" },
  { q: "The limit does not exist.", who: "Cady Heron", src: "Mean Girls" },

  // Black Swan
  { q: "I was perfect.", who: "Nina Sayers", src: "Black Swan" },
  { q: "The only person standing in your way is you.", who: "Thomas Leroy", src: "Black Swan" },

  // The Naked Gun
  { q: "Nice beaver! — Thank you, I just had it stuffed.", who: "Frank Drebin & Jane", src: "The Naked Gun" },

  // Knives Out
  { q: "A doughnut hole in a doughnut's hole.", who: "Benoit Blanc", src: "Knives Out" },
  { q: "My house, my rules, my coffee.", who: "Marta's mug", src: "Knives Out" },

  // Jennifer's Body
  { q: "Hell is a teenage girl.", who: "Needy Lesnicki", src: "Jennifer's Body" },
  { q: "I'm not killing people. I'm killing boys.", who: "Jennifer Check", src: "Jennifer's Body" },

  // Batman
  { q: "I'm Batman.", who: "Batman", src: "Batman (1989)" },
];
