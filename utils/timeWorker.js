const createNormalTime = (msDate) => {
    const milliseconds = new Date(msDate);
    let hour = milliseconds.getHours().toString();
    let minutes = milliseconds.getMinutes().toString();
    hour.length === 1 ? hour = hour + '0' : null;
    minutes.length === 1 ? minutes = minutes + '0' : null;
    const date = milliseconds.getDate();
    const month = milliseconds.getUTCMonth();
    const year = milliseconds.getFullYear();
    let stringDate = `${hour}:${minutes} ${date}.${month + 1}.${year}`;

    if (stringDate.includes('NaN')) {
        stringDate = '-';
        return stringDate;
    } else {
        return stringDate;
    }
};

module.exports = createNormalTime;