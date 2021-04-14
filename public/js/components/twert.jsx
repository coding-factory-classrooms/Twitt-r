class Twert extends React.Component {
    state = {
        isRetweeted: this.setRTimage(),
        isFav: this.setFavImage()
    }
    setRTimage() {
        let foundMatch = false
        this.props.twert.retweet.forEach(retweet => { if (retweet == this.props.user._id) foundMatch = true })
        return foundMatch
    }
    setFavImage() {
        let foundMatch = false
        this.props.twert.fav.forEach(fav => { if (fav == this.props.user._id) foundMatch = true })
        return foundMatch
    }
    commentThisTwert(twertId, userId, authorId) {
        // Display the comment input
        const twertElement = document.getElementById(this.props.twert._id)
        const commentTwertContainer = twertElement.querySelector('.commentTwertContainer')
        commentTwertContainer.querySelector('input').select()

        if (commentTwertContainer.style.display == 'flex') commentTwertContainer.style.display = 'none'
        else commentTwertContainer.style.display = 'flex'

        // If user hit Enter key, run the saveComment function
        twertElement.querySelector('.commentTwertContainer input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveComment(twertId, userId, authorId)
        })
    }

    render() {
        return  <div className="twertCard" id={this.props.twert._id}>
                    {this.props.twert.isRetwert ? 
                        <div className="retwertMsgContainer">
                            <img src="../img/retweet2.png" alt="retwerter" />
                            <p className="retwertMsg"><a href={"profil.html?id=" + this.props.twert.retwertAuthorId}>{this.props.twert.retwertAuthor}</a> a retwerté</p>
                        </div>
                    : null}
                    <div className="twertUserAndBody" onClick={() => {goToTwertPage(this.props.twert._id)}}>
                        <div className="ppTwertContainer">
                            <div className="ppTwert">
                                <a href={"profil.html?id=" + this.props.user._id}><img src={this.props.user.profilImg} alt="profilImage"/></a>
                            </div>
                        </div>
                        <div className="twertInfoContainer">
                            <div className="twertInfo">
                                <a href={"profil.html?id=" + this.props.user._id}><p className="username">{this.props.user.username}</p></a>
                                <p className="diffTime">{getDiffTime(this.props.twert.createdAt)}</p>
                            </div>
                            <div className="twertContent">
                                <p className="body">{this.props.twert.body}</p>
                            </div>
                        </div>
                    </div>
                    <div className="interactContainer">
                        <div className="comentContainer">
                            <button type="button" className="comentIcon btn" onClick={() => {this.commentThisTwert(this.props.twert._id, this.props.accountId, this.props.twert.authorId)}}></button>
                            <p>{this.props.twert.comments.length}</p>
                        </div>
                        <div className="rtContainer">
                            <button type="button" className="rtIcon btn" onClick={() => {toggleRt(this.props.twert._id, this.props.accountId)}} style={{backgroundImage: this.state.isRetweeted ? "url('../img/retweet-green.png')" : "url('../img/retweet.png')"}}></button>
                            <p>{this.props.twert.retweet.length}</p>
                        </div>
                        <div className="favContainer">
                            <button type="button" className="favIcon btn" onClick={() => {toggleLike(this.props.twert._id, this.props.accountId)}} style={{backgroundImage: this.state.isFav ? "url('../img/like-red.png')" : "url('../img/like.png')"}}></button>
                            <p>{this.props.twert.fav.length}</p>
                        </div>
                    </div>
                    <div className="commentTwertContainer">
                        <input type="text" placeholder={"Répondre à " + this.props.user.username} />
                        <div className="commentBtnContainer" onClick={() => {saveComment(this.props.twert._id, this.props.accountId, this.props.twert.authorId)}}>
                            <p>Répondre</p>
                        </div>
                    </div>
                </div>
    }
}