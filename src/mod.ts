import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {JsonUtil} from "@spt-aki/utils/JsonUtil";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILocaleGlobalBase } from "@spt-aki/models/spt/server/ILocaleBase";
import * as fs from 'fs';

class Mod implements IPostDBLoadMod, IPreAkiLoadMod {

    logger;
    database;
    modConfig;
    constructor() {}


    public postDBLoad(container: DependencyContainer): void {
        this.modConfig = require("../config/config.json")
        this.database = container.resolve<DatabaseServer>("DatabaseServer");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        if (this.modConfig.Disabled == false) {
        this.logger.log("Loading Blackpowder ", "cyan");
        let DB = this.database.getTables()
        let ammo = require("../config/ammo.json")
        for (let item in DB.templates.items) {
            if (item != undefined && item != "" && item != null && DB.templates.items[item]._parent != undefined && DB.templates.items[item]._parent != "" && DB.templates.items[item]._parent != null) {
                if (this.getParent(item) == "5448bc234bdc2d3c308b4569" && this.has_props(item) == true) {
                    DB.templates.items[item]._props.Cartridges[0]._props.filters[0].Filter = ammo
                }
            }
        }
        for (let item in DB.templates.items) {
            if (item != undefined && item != "" && item != null && DB.templates.items[item]._parent != undefined && DB.templates.items[item]._parent != "" && DB.templates.items[item]._parent != null) {
                if(DB.templates.items[item]._props != undefined && DB.templates.items[item]._props != "" && DB.templates.items[item]._props != null && DB.templates.items[item]._props.Chambers != undefined && DB.templates.items[item]._props.Chambers != "" && DB.templates.items[item]._props.Chambers != null) {
                    DB.templates.items[item]._props.Chambers[0]._props.filters[0].Filter = ammo
                }
            }
        }
        
        if (this.modConfig.crash == true) {
            this.crash()
        }
    }

    }
    public crash() {
        this.logger.error("Intentional crash")
        process.exit(0)
    }
    public has_props(item) {
        let DB = this.database.getTables()
        let items = DB.templates.items
        if (items[item] != undefined && items[item]._props != undefined && items[item]._props != "" && Object.entries(items[item]._props).length > 5) {
            return true
        }
        else {
            return false
        }
    }
    public getParent(item) {
        let DB = this.database.getTables()
        let items = DB.templates.items
        if (items[item] != undefined && items[item]._parent != undefined && items[item]._parent != "") {
            return items[item]._parent
        }
        else {
            return "nothing"
        }
    }
}

module.exports = {
    mod: new Mod()
}
