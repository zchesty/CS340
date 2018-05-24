var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res){
  res.render('home')
});

//song routes
//-----------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/songs',function(req,res){
  var context = {}
  mysql.pool.query("SELECT song.song_id, song.song_name, song.song_length, artist.artist_name FROM song INNER JOIN artist_song ON song.song_id = artist_song.song_id INNER JOIN artist ON artist_song.artist_id = artist.artist_id WHERE artist_song.contributor_type_id is NULL ORDER BY song.song_name;", function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.songs = rows;
    //query to fill artist dropdowns
    mysql.pool.query("SELECT artist.artist_id, artist.artist_name FROM artist ORDER BY artist.artist_name", function(err,rows,fields){
      if(err) {
        next(err);
        return;
      }
      context.artists = rows;
      //query to fill artist type dropdown
      mysql.pool.query("Select contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type ORDER BY contributor_type.contributor_type_id", function(err,rows,fields){
        if(err) {
          next(err);
          return;
        }
        context.contributorType = rows;
        //query to fill album dropdown
        mysql.pool.query("SELECT album.album_id, album.album_name FROM album ORDER BY album.album_name", function(err,rows,fields){
          if(err) {
            next(err);
            return;
          }
          context.albums = rows;
          res.render('songs', context)
        });
      });
    });
  });
});
//song adding stuff
app.post('/songAdd',function(req,res,next){
  mysql.pool.query("INSERT INTO song (`song_name`, `song_length`) VALUES (?, ?)", [req.body.songName, req.body.songLength], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    mysql.pool.query("SELECT song.song_id FROM song WHERE song.song_name=?", [req.body.songName], function(err, rows, fields){
       if(err) {
      next(err);
      return;
      }
      var id = rows[0];
      id = id.song_id;
      mysql.pool.query("INSERT INTO artist_song (`song_id`, `artist_id`) VALUES (?, ?)", [id, req.body.songArtist], function(err, rows, fields){
        if(err) {
          next(err);
          return;
        }
        mysql.pool.query("INSERT INTO album_song  (`song_id`, `album_id`, `track_number`) VALUES (?, ?, ?)", [id, req.body.songAlbum, req.body.trackNumber], function(err, rows, fields){
          if(err) {
            next(err);
            return;
          }
          var red = '/songEdit/' + id;
          res.redirect(red);
        });
      });
    });
  });  
});

app.post('/songAddSecondaryArtist',function(req,res,next){
    mysql.pool.query("INSERT INTO artist_song (`song_id`, `artist_id`, `contributor_type_id`) VALUES (?, ?, ?)", [req.body.songNameSecondaryArtist, req.body.songSecondaryArtist, req.body.secondaryArtistType], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    var red = '/songEdit/' + req.body.songNameSecondaryArtist;
    res.redirect(red);
  })  
});

app.post('/songAddSecondaryAlbum',function(req,res,next){
    mysql.pool.query("INSERT INTO album_song  (`song_id`, `album_id`, `track_number`) VALUES (?, ?, ?)", [req.body.songNameSecondaryAlbum, req.body.songSecondAlbum, req.body.secondaryTrackNumber], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    var red = '/songEdit/' + req.body.songNameSecondaryAlbum;
    res.redirect(red);
  })  
});

//song delete
app.post('/songDelete/:id',function(req,res,next){
    mysql.pool.query("DELETE FROM song WHERE song_id=?", [req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/songs')
  })  
});

//song album dissacociate
app.post('/songAlbumDelete/:album_id/:song_id',function(req,res,next){
    mysql.pool.query("DELETE FROM album_song WHERE album_song.song_id=? AND album_song.album_id=?", [req.params.song_id, req.params.album_id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    var red = '/songEdit/' + req.params.song_id;
    res.redirect(red);
  })  
});

//song artist disociate
app.post('/songContributorDelete/:artist_id/:song_id',function(req,res,next){
    mysql.pool.query("DELETE FROM artist_song WHERE artist_song.song_id=? AND artist_song.artist_id=?", [req.params.song_id, req.params.artist_id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    var red = '/songEdit/' + req.params.song_id;
    res.redirect(red);
  })  
});


//song editing
app.get('/songEdit/:id',function(req,res){
  var context = {}
  mysql.pool.query("SELECT song.song_id, song.song_name, song.song_length, artist.artist_name FROM song INNER JOIN artist_song ON song.song_id = artist_song.song_id INNER JOIN artist ON artist_song.artist_id = artist.artist_id WHERE song.song_id=? AND artist_song.contributor_type_id is NULL;", [req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.song = rows[0];
    //query to fill artist dropdowns
    mysql.pool.query("SELECT artist.artist_id, artist.artist_name FROM artist ORDER BY artist.artist_name", function(err,rows,fields){
      if(err) {
        next(err);
        return;
      }
      context.artists = rows;
      //query to fill artist type dropdown
      mysql.pool.query("Select contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type ORDER BY contributor_type.contributor_type_id", function(err,rows,fields){
        if(err) {
          next(err);
          return;
        }
        context.contributorType = rows;
        //query to fill album dropdown
        mysql.pool.query("SELECT album.album_id, album.album_name FROM album ORDER BY album.album_name", function(err,rows,fields){
          if(err) {
            next(err);
            return;
          }
          context.albums = rows;
          mysql.pool.query("SELECT artist.artist_name, contributor_type.contributor_type, artist_song.artist_id, artist_song.song_id FROM `artist_song` INNER JOIN artist ON artist_song.artist_id = artist.artist_id INNER JOIN contributor_type ON artist_song.contributor_type_id = contributor_type.contributor_type_id WHERE artist_song.song_id=?", [req.params.id], function(err,rows,fields){
            if(err) {
             next(err);
             return;
            }
            context.songArtists = rows;
            mysql.pool.query("Select album.album_name, album_type.album_type, album_song.track_number, album_song.song_id, album_song.album_id FROM album_song INNER JOIN album ON album_song.album_id = album.album_id INNER JOIN album_type ON album.album_type = album_type.album_type_id WHERE album_song.song_id = ?", [req.params.id], function(err,rows,fields){
              if(err) {
               next(err);
               return;
              }
              context.songAlbums = rows;
              res.render('editSong', context)
            });
          });
        });
      });
    });
  });
});

//edit song artist type
app.post('/songContributorEdit/:artist_id/:song_id/update',function(req,res,next){
    mysql.pool.query("UPDATE artist_song SET contributor_type_id =? WHERE artist_song.song_id=? AND artist_song.artist_id=?;", [ req.body.secondaryArtistType, req.params.song_id, req.params.artist_id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    var red = '/songEdit/' + req.params.song_id;
    res.redirect(red);
  })  
});

//edit song album track
app.post('/songAlbumEdit/:album_id/:song_id/update',function(req,res,next){
    mysql.pool.query("UPDATE album_song SET album_song.track_number=? WHERE album_song.song_id=? AND album_song.album_id=?;", [req.body.secondaryTrackNumber, req.params.song_id, req.params.album_id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    var red = '/songEdit/' + req.params.song_id;
    res.redirect(red);
  })  
});


app.post('/songEdit/:id/update',function(req,res,next){
    mysql.pool.query("UPDATE song SET song.song_name=?, song.song_length=? WHERE song.song_id = ?;", [req.body.songName, req.body.songLength ,req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    mysql.pool.query("UPDATE artist_song SET artist_song.artist_id=? WHERE artist_song.song_id = ? AND artist_song.contributor_type_id is NULL;", [req.body.songArtist,req.params.id], function(err, rows, fields){
      if(err) {
        next(err);
        return;
      }
      var red = '/songEdit/' + req.params.id;
      res.redirect(red);
    });
  })  
});

app.get('/songContributorEdit/:artistId/:songId',function(req,res){
  var context = {}
  mysql.pool.query("SELECT song.song_id, song.song_name, artist.artist_name, artist.artist_id FROM song INNER JOIN artist_song ON song.song_id = artist_song.song_id INNER JOIN artist ON artist_song.artist_id = artist.artist_id WHERE artist_song.song_id =? AND artist_song.artist_id=?;",[req.params.songId, req.params.artistId] , function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.song = rows[0];
    //query to fill artist dropdowns
    mysql.pool.query("Select contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type ORDER BY contributor_type.contributor_type_id", function(err,rows,fields){
      if(err) {
        next(err);
        return;
      }
      context.contributorType = rows;
      res.render('editSongContributor', context)
    });
  });
});

app.get('/songAlbumEdit/:albumId/:songId',function(req,res){
  var context = {}
  mysql.pool.query("SELECT song.song_id, song.song_name, album.album_name, album.album_id, album_song.track_number FROM song INNER JOIN album_song ON song.song_id = album_song.song_id INNER JOIN album ON album_song.album_id = album.album_id WHERE album_song.song_id =? AND album_song.album_id=?",[req.params.songId, req.params.albumId] , function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.song = rows[0];
    res.render('editSongAlbum', context)
  });
});


//Song Search routes
//-----------------------------------------------------------------------------------------------------------------------------------
app.get('/searchSongs',function(req,res){
  res.render('searchSongs')
});

app.post('/searchSongsResults',function(req,res,next){
  context ={};
  mysql.pool.query("SELECT song.song_id, song.song_name, artist.artist_name FROM song INNER JOIN artist_song ON song.song_id = artist_song.song_id INNER JOIN artist ON artist_song.artist_id = artist.artist_id WHERE song.song_name =? AND artist_song.contributor_type_id is NULL",[req.body.songToSearch] , function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.songs = rows;
    res.render('searchSongsResults', context)
  });
});

//artists table routes
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/artists',function(req,res){
  var context = {}
  mysql.pool.query("Select artist.artist_id, artist.artist_name FROM artist ORDER BY artist.artist_name;", function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.artist = rows;
    res.render('artists',context)
  });
});

app.post('/artistAdd',function(req,res,next){
    mysql.pool.query("INSERT INTO `artist` (`artist_name`) VALUES (?);", [req.body.artistName], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/artists')
  })  
});

app.post('/artistDelete/:id',function(req,res,next){
    mysql.pool.query("DELETE FROM artist WHERE artist_id=?", [req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/artists')
  })  
});

app.get('/artistEdit/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT artist.artist_id, artist.artist_name FROM artist WHERE artist_id=?",[req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.artist = rows[0];
    res.render('editArtist', context);
  })
});

app.post('/artistEdit/:id/update',function(req,res,next){
  mysql.pool.query("SELECT artist.artist_id, artist.artist_name FROM artist WHERE artist_id=?",[req.params.id], function(err, result){
    if(err) {
      next(err);
      return;
    }
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE artist SET artist.artist_name=? WHERE artist_id=?", [req.body.artist || curVals.name, req.params.id], 
      function(err, result){
        if(err){
          next(err);
          return;
        }
        res.redirect('/artists')
      });
    }
  });
});

//albums table routes
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/albums',function(req,res){
  var context = {}
  //query to fill albums table
  mysql.pool.query("SELECT album.album_id, album.album_name, album_type.album_type, album.release_year, artist.artist_name FROM album INNER JOIN album_type ON album.album_type = album_type.album_type_id INNER JOIN artist ON album.artist_id = artist.artist_id ORDER BY album.album_name;", function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.albums = rows;
    //query to fill artist dropdown
    mysql.pool.query("SELECT artist.artist_id, artist.artist_name FROM artist ORDER BY artist.artist_name", function(err,rows,fields){
      if(err) {
        next(err);
        return;
      }
      context.artists = rows;
      //query to fill album type dropdown
      mysql.pool.query("SELECT album_type.album_type_id, album_type.album_type FROM album_type ORDER BY album_type.album_type_id", function(err,rows,fields){
        if(err) {
          next(err);
          return;
        }
        context.albumType = rows;
        res.render('albums', context)
      });
    });
  });
});

app.post('/albumAdd',function(req,res,next){
    mysql.pool.query("INSERT INTO album (`album_name`, `release_year`, `album_type`, `artist_id`) VALUES (?, ?, ?, ?)", [req.body.albumName, req.body.releaseYear, req.body.albumType, req.body.albumArtist], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/albums')
  })  
});

app.post('/albumDelete/:id',function(req,res,next){
    mysql.pool.query("DELETE FROM album WHERE album_id=?", [req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/albums')
  })  
});

app.get('/albumEdit/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT album.album_id, album.album_name, album_type.album_type, album.release_year, artist.artist_name FROM album INNER JOIN album_type ON album.album_type = album_type.album_type_id INNER JOIN artist ON album.artist_id = artist.artist_id WHERE album_id=?",[req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.album = rows[0];
    //query to fill artist dropdown
    mysql.pool.query("SELECT artist.artist_id, artist.artist_name FROM artist ORDER BY artist.artist_name", function(err,rows,fields){
      if(err) {
        next(err);
        return;
      }
      context.artists = rows;
      //query to fill album type dropdown
      mysql.pool.query("SELECT album_type.album_type_id, album_type.album_type FROM album_type ORDER BY album_type.album_type_id", function(err,rows,fields){
        if(err) {
          next(err);
          return;
        }
        context.albumType = rows;
        res.render('editAlbum', context)
      });
    });
  });
});


app.post('/albumEdit/:id/update',function(req,res,next){
  mysql.pool.query("UPDATE album SET album.album_name=?, album.release_year=?, album.album_type=?, album.artist_id=? WHERE album.album_id=?", [req.body.albumName, req.body.releaseYear, req.body.albumType, req.body.albumArtist, req.params.id], 
  function(err, result){
    if(err){
      next(err);
      return;
    }
    res.redirect('/albums')
  });
});


//contributor_type table routes
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/contributorType',function(req,res){
  var context = {}
  mysql.pool.query("Select contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type ORDER BY contributor_type.contributor_type_id;", function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.contributorType = rows;
    res.render('contributorType',context)
  });
});

app.post('/contributorTypeAdd',function(req,res,next){
    mysql.pool.query("INSERT INTO `contributor_type` (`contributor_type`) VALUES (?);", [req.body.contributorType], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/contributorType')
  })  
});

app.post('/contributorTypeDelete/:id',function(req,res,next){
    mysql.pool.query("DELETE FROM contributor_type WHERE contributor_type_id=?", [req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/contributorType')
  })  
});

app.get('/contributorTypeEdit/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type WHERE contributor_type_id=?",[req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.contributorType = rows[0];
    res.render('editContributorType', context);
  })
});

app.post('/contributorTypeEdit/:id/update',function(req,res,next){
  mysql.pool.query("SELECT contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type WHERE contributor_type_id=?",[req.params.id], function(err, result){
    if(err) {
      next(err);
      return;
    }
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE contributor_type SET contributor_type.contributor_type=? WHERE contributor_type_id=?", [req.body.contributorType || curVals.name, req.params.id], 
      function(err, result){
        if(err){
          next(err);
          return;
        }
        res.redirect('/contributorType')
      });
    }
  });
});


//album_type table routes 
//----------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/albumType',function(req,res,next){
    var context = {}
    mysql.pool.query("Select album_type.album_type_id, album_type.album_type FROM album_type ORDER BY album_type.album_type_id;", function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.albumType = rows;
    res.render('albumType', context)
  })  
});

app.post('/albumTypeAdd',function(req,res,next){
    mysql.pool.query("INSERT INTO `album_type` (`album_type`) VALUES (?);", [req.body.albumType], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/albumType')
  })  
});

app.post('/albumTypeDelete/:id',function(req,res,next){
    mysql.pool.query("DELETE FROM album_type WHERE album_type_id=?", [req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/albumType')
  })  
});

app.get('/albumTypeEdit/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT album_type.album_type_id, album_type.album_type FROM album_type WHERE album_type_id=?",[req.params.id], function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.albumType = rows[0];
    res.render('editAlbumType', context);
  })
});

app.post('/albumTypeEdit/:id/update',function(req,res,next){
  mysql.pool.query("SELECT album_type.album_type_id, album_type.album_type FROM album_type WHERE album_type_id=?",[req.params.id], function(err, result){
    if(err) {
      next(err);
      return;
    }
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE album_type SET album_type.album_type=? WHERE album_type_id=?", [req.body.albumType || curVals.name, req.params.id], 
      function(err, result){
        if(err){
          next(err);
          return;
        }
        res.redirect('/albumType')
      });
    }
  });
});

//plays table routes 
//----------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/plays', function(req,res){
  var context = {};
  mysql.pool.query("SELECT song.song_id, song.song_name, COUNT(plays.song_id) AS num_plays, MAX(date_time) AS last_played FROM plays INNER JOIN song ON plays.song_id = song.song_id GROUP BY plays.song_id", function(err, rows, fields){
    if(err) {
      next(err);
      return;
    }
    context.playCounts = rows;
    mysql.pool.query("SELECT plays.play_id, song.song_name, plays.date_time AS play_time FROM plays INNER JOIN song ON plays.song_id = song.song_id", function(err, rows, fields){
      if(err) {
        next(err);
        return;
      }
      context.playsAll = rows;
      mysql.pool.query("SELECT song.song_id, song.song_name FROM song ORDER BY song.song_name", function(err, rows, fields){
        if(err) {
          next(err);
          return;
        }
        context.songs = rows;
        res.render('plays', context);
      });
    });
  });
});

app.post('/addplay',function(req,res,next){
  mysql.pool.query("INSERT INTO plays (`song_id`) VALUES (?);",[req.body.songName], function(err, result){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/plays');
  });
});

app.post('/addplay/:id',function(req,res,next){
  mysql.pool.query("INSERT INTO plays (`song_id`) VALUES (?);",[req.params.id], function(err, result){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/plays');
  });
});

app.post('/playDelete/:id',function(req,res,next){
  mysql.pool.query("DELETE FROM plays WHERE play_id=?;",[req.params.id], function(err, result){
    if(err) {
      next(err);
      return;
    }
    res.redirect('/plays');
  });
});



app.use(function(req,res){
  res.status(404);
  res.render('404');
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
