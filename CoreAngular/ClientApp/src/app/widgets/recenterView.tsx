import Widget from "@arcgis/core/widgets/Widget"
import { property, subclass } from "@arcgis/core/core/accessorSupport/decorators"

import { tsx, messageBundle } from "@arcgis/core/widgets/support/widget";

import MapView from "@arcgis/core/views/MapView"

import { init } from "@arcgis/core/core/watchUtils"

interface RecenterParams extends __esri.WidgetProperties {
    view: MapView;
}

interface State {
    x: number
    y: number
    scale: number
    interacting: boolean
}

@subclass("esri.widgets.RecenterWidget")
class RecenterWidget extends Widget {


    constructor(options: RecenterParams) {
        super(options);
    }

    override postInitialize(): void {
        this.view.when().then(() => {
            this.center = [this.view.center.x, this.view.center.y];
            init(this, ["view.center", "view.scale", "view.interacting"], this._onViewChange);
        })
    }

    @property()
    view!: MapView

    @property()
    center!: number[]

    @property()
    state!: State

    override render() {
        if (!this.state)
            return <div></div>;
        let { x, y, scale } = this.state
        let styles = { textShadow: "-5px 0 red, 0 5px red, 5px 0 red, 0 -5px red", backgroundColor: "red", color: "white" };

        return (
            <div
                bind={this}
                onClick={this._defaultCenter}
                styles={styles}
            > <app-recenter></app-recenter><div id='widgetTitle' ></div>
                <p>x: {Number(x).toFixed(3)}</p>
                <p>y: {Number(y).toFixed(3)}</p>
                <p>scale: {Number(scale).toFixed(3)}</p>
            </div>);
    }

    private _onViewChange() {
        let { interacting, center, scale } = this.view;
        this.state = {
            x: center.x,
            y: center.y,
            interacting,
            scale,
        };
    }

    private _defaultCenter() {
        console.log("recenter")
        this.view.goTo(this.center)
        
        //this.view.center.set("x",this.center[0])
        //this.view.center.set("y",this.center[1])
    }
}


export default RecenterWidget;
