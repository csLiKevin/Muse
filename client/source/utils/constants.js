export const FOOTER_HEIGHT = 52; // px

export const ROUTES = {
    history: {exact: true, path: "/history/", strict: true},
    home: {exact: true, path: "/", strict: true},
    queue: {exact: true, path: "/queue/", strict: true},
    song: {exact: true, path: "/songs/:persistentId/", strict: true}
};

export default {
    FOOTER_HEIGHT,
    ROUTES
};
