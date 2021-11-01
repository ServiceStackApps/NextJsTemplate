import Page from '../components/layout-page'
import { UserCircleIcon } from '@heroicons/react/outline'

export default () => {
    return (
        <Page title="About page">
            <UserCircleIcon className="w-36 h-36 text-gray-700" />
            This is the About page.
        </Page>
    )
}