function timeFormatFromSeconds(seconds) {
    let minutes = Math.floor( (seconds / 60.0) )
    seconds = Math.floor(seconds % 60.0);

    minutes = minutes < 10 ? "0" + minutes : minutes
    seconds = seconds < 10 ? "0" + seconds : seconds

    return `${minutes}:${seconds}`
}

module.exports = {timeFormatFromSeconds}