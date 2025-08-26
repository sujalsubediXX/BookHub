import Genre from "../modules/genre.module.js";

export const getGenre = async (req, res) => {
  try {
    const genres = await Genre.find(); 
    res.status(200).json(genres);
  } catch (error) {
    console.error(`Error occurred while fetching genres: ${error.message}`);
    res
      .status(500)
      .json({ message: "An error occurred while fetching genres." });
  }
};

export const addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);

    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ message: "This genre already exists" });
    } else {
      const createdGenre = new Genre({
        name: name,
      });

      await createdGenre.save();

      res.status(201).json(createdGenre); 
    }
  } catch (error) {
    console.log(`Error occurred while adding genre: ${error.message}`);
    res.status(500).json({ message: "Internal server error in Genre." });
  }
};

// export const editGenre = async (req, res) => {
 
// };

