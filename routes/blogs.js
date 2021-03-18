const express = require('express');
const Blog = require('./../models/Blog');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
   destination: function (request, file, callback) {
    callback(null, './public/uploads/images');
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
  filenamenew: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.get('/new', (request, response) => {
  response.render('new');
});

router.get('/:slug', async (request, response) => {
  let blog = await Blog.findOne({ slug: request.params.slug });

  if (blog) {
    response.render('show', { blog: blog });
  } else {
    response.redirect('/');
  }
});

router.post('/', upload.single('image'), async (request, response) => {
  console.log(request.file);
  // console.log(request.body);
  let blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    description: request.body.description,
    img: request.file.filename,
  });

  try {
    blog = await blog.save();

    response.redirect(`blogs/${blog.slug}`);
  } catch (error) {
    console.log(error);
  }
});

router.get('/edit/:id', async (request, response) => {
  let blog = await Blog.findById(request.params.id);
  response.render('edit', { blog: blog });
});

router.put("/:id", upload.single("image"),async(request, response) => {
  
  request.blog = await Blog.findById(request.params.id);
  let blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    description: request.body.description,
    img: request.file.filename,
  });

  try {
    blog = await blog.save();
    
    response.redirect(`/blogs/${blog.slug}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/seblogs/edit/${blog.id}`, { blog: blog });
  }
});

router.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.redirect('/');
});

module.exports = router;
