import * as R from 'ramda';

export const filterUsingKey = <T>(list: {[key: string]: T}, predicate: (key: string, value: T) => boolean): {[key: string]: T} => {
    return R.reduce((acc, key: string) => {
        if (predicate(key, list[key])) {
            return {
                ...acc,
                [key]: list[key]
            }
        }

        return acc;
    }, {}, R.keys(list));;
}