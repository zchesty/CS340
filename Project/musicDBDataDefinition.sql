-- UPDATED FOR STEP 4: comment spacing!

CREATE TABLE `contributor_type` (
    `contributor_type_id` int(11) NOT NULL AUTO_INCREMENT,
    `contributor_type` varchar(255) NOT NULL,
    PRIMARY KEY (`contributor_type_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
CREATE TABLE `album_type` (
    `album_type_id` int(11) NOT NULL AUTO_INCREMENT,
    `album_type` varchar(255) NOT NULL,
    PRIMARY KEY (`album_type_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
CREATE TABLE `artist` (
    `artist_id` int(11) NOT NULL AUTO_INCREMENT,
    `artist_name` varchar(255) NOT NULL,
    PRIMARY KEY (`artist_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
CREATE TABLE `album` (
    `album_id` int(11) NOT NULL AUTO_INCREMENT,
    `album_name` varchar(255) NOT NULL,
    `release_year` YEAR DEFAULT NULL,
    `album_type` int(11) DEFAULT NULL,
    `artist_id` int(11) NOT NULL,
    PRIMARY KEY (`album_id`),
    FOREIGN KEY (album_type) REFERENCES album_type(album_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
CREATE TABLE `song` (
    `song_id` int(11) NOT NULL AUTO_INCREMENT,
    `song_name` varchar(255) NOT NULL,
    `song_length` TIME NOT NULL,
    PRIMARY KEY (`song_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
CREATE TABLE `plays` (
	`play_id` int(11) NOT NULL AUTO_INCREMENT,
    `song_id` int(11) NOT NULL,
    `date_time` TIMESTAMP NOT NULL,
    PRIMARY KEY (`play_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
CREATE TABLE `artist_song` (
    `song_id` int(11) NOT NULL,
    `artist_id` int(11) NOT NULL,
    `contributor_type_id` int(11) DEFAULT NULL, 
    PRIMARY KEY (`song_id`, `artist_id`),
    FOREIGN KEY (song_id) REFERENCES song(song_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (contributor_type_id) REFERENCES contributor_type(contributor_type_id) ON DELETE SET NULL ON UPDATE CASCADE
    ) 
	
CREATE TABLE `album_song` (
    `song_id` int(11) NOT NULL,
    `album_id` int(11) NOT NULL,
    `track_number` int(11) NOT NULL, 
    PRIMARY KEY (`song_id`, `album_id`),
    FOREIGN KEY (song_id) REFERENCES song(song_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (album_id) REFERENCES album(album_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
	
-- Inserting data
INSERT INTO `contributor_type` (`contributor_type`) VALUES
('Featured'),
('Producer'),
('Sampled');

INSERT INTO `album_type` (`album_type`) VALUES
('Studio'),
('EP'),
('Single');

INSERT INTO `artist` (`artist_name`) VALUES
('Third Eye Blind'),
('blink-182'),
('Snoop Dogg'),
('Eminem'),
('Kanye West'),
('Chance The Rapper'),
('Dr. Dre'),
('Eric Church'),
('Blake Shelton');


INSERT INTO album (`album_name`, `release_year`, `album_type`, `artist_id`) VALUES
('Third Eye Blind', 1999, 1, 1),
('Take Off Your Pants And Jacket', 2001, 1, 2);

-- adding Songs on 'Third Eye Blind' by 'Third Eye Blind'
INSERT INTO song (`song_name`, `song_length`) VALUES
('Losing A Whole Year', 0321),
('Narcolepsy', 0348),
('Semi-Charmed Life', 0428),
('Jumper', 0433),
('Graduate', 0433),
('How\'s It Going To Be', 0413),
('Thanks A Lot', 0458),
('Burning Man', 0300),
('Good For You', 0352),
('London', 0307),
('I Want You', 0429),
('The Background', 0457),
('Motorcycle Drive By', 0423),
('God Of Wine', 0517);

-- maps songs from above query to the correct artist
INSERT INTO artist_song (`song_id`, `artist_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1);

-- maps songs from two querys above to corect album 
INSERT INTO album_song (`song_id`, `album_id`, `track_number`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 1, 10),
(11, 1, 11),
(12, 1, 12),
(13, 1, 13),
(14, 1, 14);

-- adding songs on 'Take Off Your Pants And Jacket' by 'blink-182'
INSERT INTO song (`song_name`, `song_length`) VALUES
('Anthem Part Two', 0347),
('Online Songs', 0226),
('First Date', 0252),
('Happy Holidays, You Bastard', 0042),
('Story Of A Lonely Guy', 0340),
('The Rock Show', 0252),
('Stay Together For The Kids', 0359),
('Roller Coaster', 0248),
('Reckless Abandon', 0306),
('Every Time I Look For You', 0305),
('Give Me One Good Reason', 0319),
('Shut Up', 0320),
('Please Take Me Home', 0306);


INSERT INTO artist_song (`song_id`, `artist_id`) VALUES
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2);


INSERT INTO album_song (`song_id`, `album_id`, `track_number`) VALUES
(15, 2, 1),
(16, 2, 2),
(17, 2, 3),
(18, 2, 4),
(19, 2, 5),
(20, 2, 6),
(21, 2, 7),
(22, 2, 8),
(23, 2, 9),
(24, 2, 10),
(25, 2, 11),
(26, 2, 12),
(27, 2, 13);

-- adding a few Snoop Dogg songs
INSERT INTO album (`album_name`, `release_year`, `album_type`, `artist_id`) VALUES
('Doggystyle', 1993, 1, 3);

INSERT INTO song (`song_name`, `song_length`) VALUES
('The Shiznit', 0441),
('Who Am I (What\'s My Name)?', 0406);

INSERT INTO artist_song (`song_id`, `artist_id`) VALUES
(28, 3),
(29, 3);

INSERT INTO album_song (`song_id`, `album_id`, `track_number`) VALUES
(28, 3, 4),
(29, 3, 8);

-- adding eminem songs and albums and featured/sampled artists
INSERT INTO album (`album_name`, `release_year`, `album_type`, `artist_id`) VALUES
('The Eminem Show', 2002, 1, 4),
('The Marshall Mathers LP', 2000, 1, 4);

INSERT INTO song (`song_name`, `song_length`) VALUES
('Cleanin\' Out My Closet', 0458),
('Without Me', 0450),
('Sing For The Moment', 0540),
('Superman', 0550),
('The Real Slim Shady', 0444);

INSERT INTO `artist` (`artist_name`) VALUES
('Aerosmith'),
('Dina Rae'); 

INSERT INTO artist_song (`song_id`, `artist_id`, `contributor_type_id`) VALUES
(30, 4, NULL),
(31, 4, NULL),
(32, 4, NULL),
(33, 4, NULL),
(32, 10, 3), -- set artist id 10 as sampled for song 32, aerosmith sampled in sing for the moment by eminem
(33, 11, 1), -- set artist id 11 as features for song 33, Dina Rae features in superman
(34, 4, NULL);

INSERT INTO album_song (`song_id`, `album_id`, `track_number`) VALUES
(30, 4, 4),
(31, 4, 8),
(32, 4, 12), 
(33, 4, 13),
(34, 5, 8);

-- the plays table tracks that one song has been played song with id 3.
INSERT INTO plays (`song_id`) VALUES 
(3);





