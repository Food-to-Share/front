import { ArrowDownKeyboardIcon, ArrowUpKeyboardIcon, MoreIcon } from "../Icons"
import "./Featured.css"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Featured = () => {
    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">Meals Delivered</h1>
                <MoreIcon/>
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar value={70} text={"70%"} strokeWidth={5}/>
                </div>
                <p className="title">Total sales made today</p>
                <p className="amount">70/100</p>
                <p className="desc">
                    Previous transactions processing. Last deliveries may not be included.
                </p>
                <div className="summary">
                    <div className="item">
                        <div className="itemTitle">
                            Breakfast
                        </div>
                        <div className="itemResult">
                            <div className="resultAmount">
                                41
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">
                            Lunch
                        </div>
                        <div className="itemResult">
                            <div className="resultAmount">
                                27
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">
                            Dinner
                        </div>
                        <div className="itemResult">
                            <div className="resultAmount">
                                2
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Featured