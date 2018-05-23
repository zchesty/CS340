-- Data Manipulation Queries

-- -------------------------------------------------------------------------------------
-- Songs Page Queries
-- -------------------------------------------------------------------------------------
-- select songs to display
SELECT song.song_name, song.song_length, album.album_name, artist.artist_name FROM song 
INNER JOIN album_song ON song.song_id = album_song.song_id
INNER JOIN album ON album_song.album_id = album.album_id
INNER JOIN artist_song ON song.song_id = artist_song.song_id
INNER JOIN artist ON artist_song.artist_id = artist.artist_id
WHERE artist_song.contributor_type_id is NULL -- only get main artist for this table
ORDER BY song.song_name;

-- view all artists for a song
SELECT artist.artist_name FROM artist 
INNER JOIN artist_song ON artist.artist_id = artist_song.artist_id
INNER JOIN song ON artist_song.song_id = song.song_id
WHERE song.song_name = [songName];

-- select artists to fill in artist dropdown
SELECT artist.artist_id, artist.artist_name FROM artist 

-- select songs to fill in song dropdown
SELECT song.song_id, song.song_name FROM song


-- select contributor type to fill artist type dropdown
Select contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type ORDER BY contributor_type.contributor_type_id;

-- select album ot fill in ablbum dropdown
SELECT album.album_id, album.album_name FROM album ORDER BY album.album_name;

-- add new song
	-- definitely must add to song table, artist_song and album_song tables
	-- song table
	INSERT INTO song (`song_name`, `song_length`) VALUES ([song_name], [song_length])

	--artist_song
	INSERT INTO artist_song (`song_id`, `artist_id`) 
	VALUES ([song_id], [artist_id])

	--album_song
	INSERT INTO album_song	(`song_id`, `album_id`, `track_number`) 
	VALUES ([song_id], [album_id], [track_number])

-- add secondary artist to a song
	-- add to artist_song table
	INSERT INTO artist_song (`song_id`, `artist_id`, `contributor_type_id`) 
	VALUES ([song_id], [artist_id], [contributor_type_id])

-- add another album for a song
	-- add to album song table	
	INSERT INTO album_song	(`song_id`, `album_id`, `track_number`) 
	VALUES ([song_id], [album_id], [track_number])

-- delete song
DELETE FROM song WHERE song_id=[song_id]; -- this will also delete relevant rows from artist_song and album_song they are set up to cascade


-- -------------------------------------------------------------------------------------
-- edit Song Page Queries
-- -------------------------------------------------------------------------------------
-- retreive song information
SELECT song.song_id, song.song_name, song.song_length, album.album_name, artist.artist_name, album_song.track_number FROM song 
INNER JOIN album_song ON song.song_id = album_song.song_id 
INNER JOIN album ON album_song.album_id = album.album_id 
INNER JOIN artist_song ON song.song_id = artist_song.song_id 
INNER JOIN artist ON artist_song.artist_id = artist.artist_id 
WHERE song.song_id=?;

-- retrieve song artist information
SELECT artist.artist_name, contributor_type.contributor_type, artist_song.artist_id, artist_song.song_id FROM `artist_song`
INNER JOIN artist ON artist_song.artist_id = artist.artist_id
INNER JOIN contributor_type ON artist_song.contributor_type_id = contributor_type.contributor_type_id
WHERE artist_song.song_id=[song_id]

-- retrieve album information
Select album.album_name, album_type.album_type, album_song.track_number, album_song.song_id, album_song.album_id FROM album_song
INNER JOIN album ON album_song.album_id = album.album_id
INNER JOIN album_type ON album.album_type = album_type.album_type_id
WHERE album_song.song_id = [song_id]

-- edit song table
	UPDATE song SET song.song_name= [song_name], song.song_length = [song_length], song.artist_id = [artist_id]
	WHERE song.song_id = [song_id];


-- edit album_song table
	-- selct from table to disply 
	SELECT song.song_id, song.song_name, album.album_name, album.album_id, album_song.track_number FROM song INNER JOIN album_song ON song.song_id = album_song.song_id INNER JOIN album ON album_song.album_id = album.album_id WHERE album_song.song_id =[song_id] AND album_song.album_id=[album_id]
	-- update album track number for song
	UPDATE album_song SET album_song.track_number=[track_number] 
	WHERE album_song.song_id=[song_id] AND album_song.album_id=[album_id];
	-- delete album song relation
	DELETE FROM album_song WHERE album_song.song_id=[song_id] AND album_song.album_id=[album_id];
-- edit artist_song table
	-- select from table to display
	SELECT song.song_id, song.song_name, artist.artist_name, artist.artist_id FROM song INNER JOIN artist_song ON song.song_id = artist_song.song_id INNER JOIN artist ON artist_song.artist_id = artist.artist_id WHERE artist_song.song_id =[song_id] AND artist_song.artist_id=[artist_id];
	-- update contributor type of artist on song
	UPDATE artist_song SET contributor_type_id = [contributor_type_id]
	WHERE artist_song.song_id=[song_id] AND artist_song.artist_id=[artist_id];
	-- delete contributor on song
	DELETE FROM artist_song WHERE artist_song.song_id=[song_id] AND artist_song.artist_id=[artist_id];
-- -------------------------------------------------------------------------------------
-- add album apge Queries
-- -------------------------------------------------------------------------------------

-- select albums types to fill the album type dropdown
SELECT album_type.album_type_id, album_type.a FROM album_type ORDER BY album_type.album_type_id

-- select artists to fill in artist dropdown
SELECT artist.artist_id, artist.artist_name FROM artist ORDER BY artist.artist_name

-- add Album
INSERT INTO album (`album_name`, `release_year`, `album_type`, `artist_id`) VALUES 
([albumName], [releaseYear], [albumTypeId], [artistId])

-- show albums for display
SELECT album.album_id, album.album_name, album_type.album_type, album.release_year, artist.artist_name FROM album
INNER JOIN album_type ON album.album_type = album_type.album_type_id
INNER JOIN artist ON album.artist_id = artist.artist_id
ORDER BY album.album_name;

-- delete album
DELETE FROM album WHERE album_id=[album_id]
-- -------------------------------------------------------------------------------------
-- edit album Page Queries
-- -------------------------------------------------------------------------------------
-- get album info to display
SELECT album.album_id, album.album_name, album_type.album_type, album.release_year, artist.artist_name FROM album 
INNER JOIN album_type ON album.album_type = album_type.album_type_id 
INNER JOIN artist ON album.artist_id = artist.artist_id 
WHERE album_id=[album_id];

-- update album
UPDATE album SET album.album_name=[album_name], album.release_year=[release_year], album.album_type=[album_type_id], album.artist_id=[artist_id]
WHERE album.album_id=[album_id]

-- -------------------------------------------------------------------------------------
-- add artist Page Queries
-- -------------------------------------------------------------------------------------
-- select all artists to display
Select artist.artist_id, artist.artist_name FROM artist ORDER BY artist.artist_name;

-- add artist
INSERT INTO `artist` (`artist_name`) VALUES
([artistName]);

-- delete Artist
DELETE FROM artist WHERE artist_id=[artist_id]

-- -------------------------------------------------------------------------------------
-- Edit artist Page Queries
-- -------------------------------------------------------------------------------------
-- get artist for editing
SELECT artist.artist_id, artist.artist_name FROM artist WHERE artist_id=[artist_id]

-- update Artist
UPDATE artist SET artist.artist_name=[artist_name] WHERE artist_id=[artist_id]

-- -------------------------------------------------------------------------------------
-- add album Type Page Queries
-- -------------------------------------------------------------------------------------

-- select all albums types to display
Select album_type.album_type_id, album_type.album_type FROM album_type
ORDER BY album_type.album_type_id;

-- add type
INSERT INTO `album_type` (`album_type`) VALUES
([album_type]);

-- delete type
DELETE FROM album_type WHERE album_type_id=[album_type_id];

-- -------------------------------------------------------------------------------------
-- edit album type Page Queries
-- -------------------------------------------------------------------------------------
-- get album type name for editing
SELECT album_type.album_type_id, album_type.album_type FROM album_type WHERE album_type_id=[album_type_id]

-- Update album type name
UPDATE album_type SET album_type.album_type=[album_type] WHERE album_type_id=[album_type_id];

-- -------------------------------------------------------------------------------------
-- add contributor type Page Queries
-- -------------------------------------------------------------------------------------
-- select all contributors types to display
Select contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type
ORDER BY contributor_type.contributor_type_id;

-- add type
INSERT INTO `contributor_type` (`contributor_type`) VALUES
([contributor_type]);

-- delete type
DELETE FROM contributor_type WHERE contributor_type_id=[contributor_type_id];

-- -------------------------------------------------------------------------------------
-- edit Contributor Type Page Queries
-- -------------------------------------------------------------------------------------
-- get contributor name and id for editing
SELECT contributor_type.contributor_type_id, contributor_type.contributor_type FROM contributor_type WHERE contributor_type_id=[contributor_type_id]

-- update contributor type 
UPDATE contributor_type SET contributor_type.contributor_type=[contributor_type] WHERE contributor_type_id=[contributor_type_id]

-- -------------------------------------------------------------------------------------
-- Plays Page Queries
-- -------------------------------------------------------------------------------------
-- get tallied list of song Plays
SELECT song.song_id, song.song_name, COUNT(plays.song_id) AS num_plays, MAX(date_time) AS last_played FROM plays 
INNER JOIN song ON plays.song_id = song.song_id
GROUP BY plays.song_id

-- get list of all play data 
SELECT plays.play_id, song.song_name, plays.date_time AS play_time FROM plays 
INNER JOIN song ON plays.song_id = song.song_id

-- delete a play
DELETE FROM plays WHERE play_id = [play_id];

-- add a play
INSERT INTO plays (`song_id`) VALUES ([song_id]);


-- Song search Queries
-- -------------------------------------------------------------------------------------
-- results
SELECT song.song_id, song.song_name, artist.artist_name FROM song 
INNER JOIN artist_song ON song.song_id = artist_song.song_id
INNER JOIN artist ON artist_song.artist_id = artist.artist_id
WHERE song.song_name = [search query] AND artist_song.contributor_type_id is NULL;
