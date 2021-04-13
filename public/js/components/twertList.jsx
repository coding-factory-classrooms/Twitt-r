class TwertList extends React.Component {

    render() {
        return <div className="twertList">
            {this.props.twertList.slice(0).reverse().map(element => (
                <Twert twert = {element.twert} user = {element.user} accountId = {accountId} key = {element.twert._id} />
            ))}
        </div>
    }
}