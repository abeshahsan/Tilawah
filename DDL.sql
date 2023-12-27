DROP TABLE IF EXISTS AUDIO_PLAYLIST;
DROP TABLE IF EXISTS PLAYLIST;

DROP TABLE IF EXISTS PROFILE;
DROP TABLE IF EXISTS CREDENTIALS;


DROP TABLE IF EXISTS AUDIO_CREATOR;
DROP TABLE IF EXISTS AUDIO;
DROP TABLE IF EXISTS COLLECTION;
DROP TABLE IF EXISTS CREATOR;

CREATE TABLE CREDENTIALS
(
    USER_ID       BIGINT AUTO_INCREMENT,
    EMAIL         VARCHAR(30),
    PASSWORD_HASH VARCHAR(64),
    CONSTRAINT CREDENTIALS_PK PRIMARY KEY (USER_ID),
    CONSTRAINT CREDENTIALS_UNIQ UNIQUE (EMAIL)
);

CREATE TABLE PROFILE
(
    USER_ID BIGINT,
    NAME    VARCHAR(20) NOT NULL,
    GENDER  TINYINT, # 1 FOR MALE, 0 FOR FEMALE
    COUNTRY VARCHAR(20),
    CONSTRAINT PROFILE_PK PRIMARY KEY (USER_ID),
    CONSTRAINT PROFILE_FK FOREIGN KEY (USER_ID)
        REFERENCES CREDENTIALS (USER_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE CREATOR
(
    CREATOR_ID   BIGINT AUTO_INCREMENT,
    CREATOR_NAME VARCHAR(100),
    CONSTRAINT CREATOR_PK PRIMARY KEY (CREATOR_ID)
);

CREATE TABLE COLLECTION
(
    COLLECTION_ID   BIGINT AUTO_INCREMENT,
    COLLECTION_NAME VARCHAR(100),
    CREATOR_ID      BIGINT,
    CONSTRAINT COLLECTION_PK PRIMARY KEY (COLLECTION_ID),
    CONSTRAINT COLLECTION_FK FOREIGN KEY (CREATOR_ID) REFERENCES CREATOR (CREATOR_ID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE AUDIO
(
    AUDIO_ID      BIGINT AUTO_INCREMENT,
    AUDIO_NAME    VARCHAR(100),
    PATH          VARCHAR(150),
    AUDIO_TYPE    INT,
    COLLECTION_ID BIGINT,
    CONSTRAINT AUDIO_PK PRIMARY KEY (AUDIO_ID),
    CONSTRAINT AUDIO_FK FOREIGN KEY (COLLECTION_ID) REFERENCES COLLECTION (COLLECTION_ID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE AUDIO_CREATOR
(
    AUDIO_ID   BIGINT,
    CREATOR_ID BIGINT,
    CONSTRAINT AUDIO_CREATOR_PK PRIMARY KEY (AUDIO_ID, CREATOR_ID),
    CONSTRAINT AUDIO_CREATOR_AUDIO_FK FOREIGN KEY (AUDIO_ID) REFERENCES AUDIO (AUDIO_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT AUDIO_CREATOR_CREATOR_FK FOREIGN KEY (CREATOR_ID) REFERENCES CREATOR (CREATOR_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE PLAYLIST
(
    PLAYLIST_ID   BIGINT AUTO_INCREMENT,
    PLAYLIST_NAME VARCHAR(100),
    USER_ID       BIGINT NOT NULL,
    CONSTRAINT PLAYLIST_PK PRIMARY KEY (PLAYLIST_ID),
    CONSTRAINT PLAYLIST_FK FOREIGN KEY (USER_ID) REFERENCES PROFILE (USER_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE AUDIO_PLAYLIST
(
    AUDIO_ID    BIGINT,
    PLAYLIST_ID BIGINT,
    CONSTRAINT AUDIO_PK PRIMARY KEY (AUDIO_ID, PLAYLIST_ID),
    CONSTRAINT AUDIO_PLAYLIST_AUDIO_FK FOREIGN KEY (AUDIO_ID) REFERENCES AUDIO (AUDIO_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT AUDIO_PLAYLIST_PLAYLIST_FK FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLIST (PLAYLIST_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE LAST_PLAYBACK
(
    USER_ID BIGINT,
    AUDIO_ID BIGINT,
    MINUTE INT,
    SECOND INT,
    PLAYLIST_ID BIGINT,
    CONSTRAINT LAST_PLAYBACK_PK PRIMARY KEY (USER_ID),
    CONSTRAINT LAST_PLAYBACK_USER_ID_FK FOREIGN KEY (USER_ID) REFERENCES CREDENTIALS (USER_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT LAST_PLAYBACK_AUDIO_ID_FK FOREIGN KEY (AUDIO_ID) REFERENCES AUDIO (AUDIO_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT LAST_PLAYBACK_PLAYLIST_ID_FK FOREIGN KEY (PLAYLIST_ID) REFERENCES PLAYLIST (PLAYLIST_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DELIMITER //
CREATE TRIGGER HANDLE_NEW_USER 
AFTER INSERT ON CREDENTIALS
FOR EACH ROW 
    BEGIN
        INSERT INTO PROFILE (USER_ID, NAME) VALUES (NEW.USER_ID, '');
        INSERT INTO LAST_PLAYBACK VALUES (NEW.USER_ID, NULL, 0, 0, -1);
    END;//
DELIMITER ;