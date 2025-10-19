

const local = 'http://localhost:5000'
const production = import.meta.env.VITE_BACKEND_URL

let base_url = ''
let mode = 'pro'
if (mode === 'pro') {
    base_url = production
} else {
    base_url = local
}

export {base_url};