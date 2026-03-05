const GenreModel = require('../models/genreModel')

const genreController = {
    getAllGenres: async (req, res) => {
        try {
            const genres = await GenreModel.find({})

            res.status(200).json({
                message: 'Success',
                data: genres
            })


        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    getGenreById: async (req, res) => {
        try {
            const { id } = req.params
            const genre = await GenreModel.findById(id)

            if (!genre) {
                return res.status(404).json({
                    message: 'Genre not found',
                    success: false
                })
            }

            res.status(200).json({
                message: 'Success',
                data: genre
            })
        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    deleteGenreById: async (req, res) => {
        try {
            const { id } = req.params
            const deletedGenre = await GenreModel.findByIdAndDelete(id)
            const genres = await GenreModel.find({})

            if (!deletedGenre) {
                return res.status(404).json({
                    message: 'Genre not found or already deleted',
                    success: false
                })
            }

            res.status(200).json({
                message: 'Genre deleted successfully',
                data: deletedGenre,
                allGenres: genres
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    addNewGenre: async (req, res) => {
        // console.log(req.body); 

        try {

            const newGenre = new GenreModel({
                ...req.body
            })

            await newGenre.save()

            res.status(201).json({
                message: 'Genre created successfully',
                data: newGenre
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    },
    updateGenreById: async (req, res) => {
        try {
            const { id } = req.params

            const updatedGenre = await GenreModel.findByIdAndUpdate(id, { ...req.body }, { new: true })

            if (!updatedGenre) {
                return res.status(404).json({
                    message: 'Genre not found',
                    success: false
                })
            }

            res.status(200).json({
                message: 'Genre updated successfully',
                data: updatedGenre
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                success: false
            })
        }
    }
}



module.exports = genreController
