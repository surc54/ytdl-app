const TIME_CONVERSION_MULTIPLIERS = [1, 60, 60 * 60, 24 * 60 * 60];

export const convertTime = (s: string): number => {
    const split = s.split(":").reverse();
    let time = 0;

    split.forEach((x, index) => {
        time += Number(x) * TIME_CONVERSION_MULTIPLIERS[index];
    });

    return time;
};
