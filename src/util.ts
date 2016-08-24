export function isEmpty(obj: Object): boolean {
    for (let x in obj) {
        return false;
    }
    return true;
}
