function displayDate(firebaseDate) {
    if (!firebaseDate) {
        return "Date processing";
    }

    const date = firebaseDate.toDate();
    const currentDate = new Date();

    const timeDiff = Math.abs(Math.floor((currentDate - date) / 1000)); // Time difference in seconds
    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute * 60;
    const secondsInDay = secondsInHour * 24;
    const secondsInWeek = secondsInDay * 7;
    const secondsInYear = secondsInDay * 365;
    console.log(timeDiff)
    console.log(currentDate)
    console.log(date)
    if (timeDiff < secondsInMinute) {
        return `${timeDiff} sec${timeDiff > 1 ? 's' : ''} ago`;
    } else if (timeDiff < secondsInHour) {
        const minutes = Math.floor(timeDiff / secondsInMinute);
        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDiff < secondsInDay) {
        const hours = Math.floor(timeDiff / secondsInHour);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (timeDiff < secondsInWeek) {
        if (timeDiff < secondsInDay * 2) {
            return "1 day ago";
        } else {
            const days = Math.floor(timeDiff / secondsInDay);
            return `${days} days ago`;
        }
    } else if (timeDiff < secondsInYear) {
        
        return `${day} ${month}`;
    } else {
        const day = date.getDate();
        const year = date.getFullYear();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        return `${day} ${month} ${year}`;
    }
}