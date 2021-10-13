const createNormalTime = (msDate) => {
    const milliseconds = new Date(msDate);
    const hour = milliseconds.getHours();
    const minutes = milliseconds.getMinutes();
    const date = milliseconds.getDate();
    const month = milliseconds.getUTCMonth();
    const year = milliseconds.getFullYear();
    let stringDate = `${hour}:${minutes} ${date}.${month + 1}.${year}`;

    if (stringDate.includes('NaN')) {
        return (stringDate = '-');
    } else {
        return stringDate;
    }
};

module.exports = createNormalTime;