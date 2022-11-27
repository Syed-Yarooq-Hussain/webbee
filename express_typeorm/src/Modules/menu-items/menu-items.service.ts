import { MenuItem } from './entities/menu-item.entity';
import { Repository } from "typeorm";
import App from "../../app";


interface IMenuItem {
    id: number,
    name: string,
    url: string,
    parentId: number,
    createdAt: string,
    children?: IMenuItem[]
}

export class MenuItemsService {

  private menuItemRepository: Repository<MenuItem>;

  constructor(app: App) {
    this.menuItemRepository = app.getDataSource().getRepository(MenuItem);
  }

  /* TODO: complete getMenuItems so that it returns a nested menu structure
    Requirements:
    - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
    - it should work for infinite level of depth (children of childrens children of childrens children, ...)
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - post process your results in javascript
    Hints:
    - open the `src/menu-items/menu-items.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /menu:
    ```json
    [
        {
            "id": 1,
            "name": "All events",
            "url": "/events",
            "parentId": null,
            "createdAt": "2021-04-27T15:35:15.000000Z",
            "children": [
                {
                    "id": 2,
                    "name": "Laracon",
                    "url": "/events/laracon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 3,
                            "name": "Illuminate your knowledge of the laravel code base",
                            "url": "/events/laracon/workshops/illuminate",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 4,
                            "name": "The new Eloquent - load more with less",
                            "url": "/events/laracon/workshops/eloquent",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "Reactcon",
                    "url": "/events/reactcon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 6,
                            "name": "#NoClass pure functional programming",
                            "url": "/events/reactcon/workshops/noclass",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 7,
                            "name": "Navigating the function jungle",
                            "url": "/events/reactcon/workshops/jungle",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
  */

   getMenuItems = async () => {
    try{
        let menuItems : any= await this.menuItemRepository.find();
        menuItems[0].children = []
        await this.addChildMenu(menuItems, menuItems[0]);

        return menuItems;
    }catch(e){
        throw new Error('TODO in task 3');    
    }
    
  }

  addChildMenu = async (menuItems: IMenuItem[] , currentMenu: any) => {

    for(let i=0 ; i < menuItems.length; i++){
        if(currentMenu.id == menuItems[i].parentId){
            menuItems[i].children = []
            currentMenu.children.push(menuItems[i])
            menuItems.splice(i, 1)
            i--;
        }
    }

    for(let j=0 ; j< currentMenu.children.length ; j++ ){
        await this.addChildMenu(menuItems, currentMenu.children[j])
    }

    
  } 
}
