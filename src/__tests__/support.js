
const support = require('../javascript/support');

afterEach(() => {
    document.body.innerHTML = "";
});

test("create JSON to save todo in localStorage", () => {
    //Arrange
    let id = "4";
    let checked = true;
    let descriptionText = "texto de test";

    //Act
    const createdJSON = support.createJSON(id, checked, descriptionText);

    //Assert
    expect(createdJSON.id).toBe(id);
    expect(createdJSON.checked).toBe(checked);
    expect(createdJSON.descriptionText).toBe(descriptionText);
    expect(createdJSON).not.toBeNull();
    expect(createdJSON).not.toBeUndefined();
});

describe("get filter status todos ", () => {
    test('filter status todo Active, response -> "" ', () => {
        //Arrange
        const filterCommand = "Active";
        const expected = "";

        //Act
        const response = support.getFilterStatusCommand(filterCommand);

        //Assert
        expect(response).toBe(expected);
    });

    test('filter status todo Completed, response -> "completed" ', () => {
        //Arrange
        const filterCommand = "Completed";
        const expected = "completed";

        //Act
        const response = support.getFilterStatusCommand(filterCommand);

        //Assert
        expect(response).toBe(expected);
    });
});

describe("remove todo conainer and check container", () => {
    beforeEach(() => {
        let checkContainer = document.createElement("div");
        checkContainer.id = "item1";
        let todoContainer = document.createElement("div");
        todoContainer.id = "container1";

        document.body.insertAdjacentElement("beforeend", checkContainer);
        document.body.insertAdjacentElement("beforeend", todoContainer);
    })

    afterEach(() => {
        document.body.innerHTML = "";
    });

    test("removing existing containers", () => {
        //Arrange
        const idToRemove = "1";

        //Act
        support.removeTodoItem(idToRemove);

        //Assert
        expect(document.body.hasChildNodes()).toBeFalsy();
        expect(document.body.innerHTML).toBe("");
    });

    test("removing non-existing containers", () => {
        //Arrange
        const idToRemove = "2";

        //Act

        //Assert
        expect(() => {
            support.removeTodoItem(idToRemove);
        }).toThrow();
        expect(() => {
            support.removeTodoItem(idToRemove);
        }).toThrow("Error item doesn't exist");
        expect(document.body.hasChildNodes()).toBeTruthy();
        expect(document.body.innerHTML).not.toBe("");
    });
});

test("createn a new Todo check (this is the check container)", () => {
    //Arrange
    const nodeNameWillBeCreated = "DIV";
    const nodeId = "item1";
    const nodeClassList = ["check"];
    const nodeHoverTitle = "Mark as completed";
    const idNumberGenerated = 1;

    //Act
    const newElement = support.createNewTodoCheck(idNumberGenerated);

    //Assert
    expect(newElement).not.toBeNull();
    expect(newElement.hasAttributes()).toBeTruthy();
    expect(newElement.hasAttribute("title")).toBeTruthy();
    expect(newElement.hasAttribute("id")).toBeTruthy();
    expect(newElement.hasAttribute("class")).toBeTruthy();
    expect(newElement.nodeName).toEqual(nodeNameWillBeCreated);
    expect(newElement.id).toEqual(nodeId);
    expect(newElement.classList.length).toEqual(nodeClassList.length);
    expect(newElement.classList[0]).toEqual(nodeClassList[0]);
    expect(newElement.title).toEqual(nodeHoverTitle);
});

test("createn a new check mark", () => {
    //Arrange
    const nodeNameWillBeCreated = "INPUT";
    const nodeId = "check12";
    const nodeClassList = ["checkThis"];
    const nodeType = "checkbox";
    const nodeEvent = "recieveCheckChangeEvent(event)";
    const idNumberGenerated = 12;

    //Act
    const newElement = support.createCheckMark(idNumberGenerated, false);

    //Assert
    expect(newElement).not.toBeNull();
    expect(newElement.hasAttributes()).toBeTruthy();
    expect(newElement.hasAttribute("id")).toBeTruthy();
    expect(newElement.hasAttribute("class")).toBeTruthy();
    expect(newElement.hasAttribute("onchange")).toBeTruthy();
    expect(newElement.hasAttribute("type")).toBeTruthy();
    expect(newElement.nodeName).toEqual(nodeNameWillBeCreated);
    expect(newElement.id).toEqual(nodeId);
    expect(newElement.type).toEqual(nodeType);
    expect(newElement.getAttribute("onchange")).toEqual(nodeEvent);
    expect(newElement.classList.length).toEqual(nodeClassList.length);
    expect(newElement.classList[0]).toEqual(nodeClassList[0]);
    expect(newElement.checked).toBeFalsy();
});

test("createn check label for a check mark", () => {
    //Arrange
    const checkMark = document.createElement("input");
    checkMark.type = "checkbox"
    checkMark.id = "check14"

    //Act
    const newElement = support.createCheckLabel(checkMark);

    //Assert
    expect(newElement).not.toBeNull();
    expect(newElement.hasAttributes()).toBeTruthy();
    expect(newElement.hasAttribute("for")).toBeTruthy();
    expect(newElement.nodeName).toBe("LABEL");
    expect(newElement.getAttribute("for")).toBe(checkMark.id);
});


test("createn a new Todo description (this is the description container)", () => {
    //Arrange
    const nodeNameWillBeCreated = "DIV";
    const nodeId = "container1";
    const nodeClassList = ["descriptions", "container_todo"];
    const idNumberGenerated = 1;

    //Act
    const newElement = support.createTodoContainer(idNumberGenerated);

    //Assert
    expect(newElement).not.toBeNull();
    expect(newElement.hasAttributes()).toBeTruthy();
    expect(newElement.hasAttribute("id")).toBeTruthy();
    expect(newElement.hasAttribute("class")).toBeTruthy();
    expect(newElement.nodeName).toEqual(nodeNameWillBeCreated);
    expect(newElement.id).toEqual(nodeId);
    expect(newElement.classList.length).toEqual(nodeClassList.length);
    expect(newElement.classList[0]).toEqual(nodeClassList[0]);
    expect(newElement.classList[1]).toEqual(nodeClassList[1]);
    expect(newElement.classList).toContain("descriptions");
    expect(newElement.classList).toContain("container_todo");
});

describe("create the todo information/description", () => {
    test("Create todo information when is checked as completed", () => {
        //Arrange
        const nodeNameWillBeCreated = "P";
        const nodeId = "description2";
        const nodeClassList = ["description_todo"];
        const nodeEvent = "startEditingTodo(event)";
        const idNumberGenerated = 2;
        const textColor = "gray";
        const textDecoration = "line-through"
        const checked = true;

        //Act
        const todoInfoTest = support.createTodoInfo(idNumberGenerated, checked);

        //Assert
        expect(todoInfoTest).not.toBeNull();
        expect(todoInfoTest).not.toBeUndefined();
        expect(todoInfoTest.nodeName).toBe(nodeNameWillBeCreated);
        expect(todoInfoTest.id).toEqual(nodeId);
        expect(todoInfoTest.classList.length).toEqual(nodeClassList.length);
        expect(todoInfoTest.classList[0]).toEqual(nodeClassList[0]);
        expect(todoInfoTest.getAttribute("ondblclick")).toEqual(nodeEvent);
        expect(todoInfoTest.style.color).toEqual(textColor);
        expect(todoInfoTest.style.textDecoration).toEqual(textDecoration);

    });

    test("Create todo information when is not checked as completed", () => {
        //Arrange
        const nodeNameWillBeCreated = "P";
        const nodeId = "description2";
        const nodeClassList = ["description_todo"];
        const nodeEvent = "startEditingTodo(event)";
        const idNumberGenerated = 2;
        const textColor = "black";
        const textDecoration = "none"
        const checked = false;

        //Act
        const todoInfoTest = support.createTodoInfo(idNumberGenerated, checked);

        //Assert
        expect(todoInfoTest).not.toBeNull();
        expect(todoInfoTest).not.toBeUndefined();
        expect(todoInfoTest.nodeName).toBe(nodeNameWillBeCreated);
        expect(todoInfoTest.id).toEqual(nodeId);
        expect(todoInfoTest.classList.length).toEqual(nodeClassList.length);
        expect(todoInfoTest.classList[0]).toEqual(nodeClassList[0]);
        expect(todoInfoTest.getAttribute("ondblclick")).toEqual(nodeEvent);
        expect(todoInfoTest.style.color).toEqual(textColor);
        expect(todoInfoTest.style.textDecoration).toEqual(textDecoration);

    });
});

test("create todo delete button", () => {
    //Arrange
    const nodeNameWillBeCreated = "LABEL";
    const nodeId = "21";
    const nodeClassList = ["delete"];
    const nodeEvent = "recieveDeleteItemEvent(event)";
    const idNumberGenerated = 21;
    const deleteTextSymbol = "X";

    //Act
    const deleteButton = support.createDeleteButton(idNumberGenerated);

    //Assert
    expect(deleteButton).not.toBeNull();
    expect(deleteButton).not.toBeUndefined();
    expect(deleteButton.nodeName).toBe(nodeNameWillBeCreated);
    expect(deleteButton.id).toEqual(nodeId);
    expect(deleteButton.classList.length).toEqual(nodeClassList.length);
    expect(deleteButton.classList[0]).toEqual(nodeClassList[0]);
    expect(deleteButton.getAttribute("onclick")).toEqual(nodeEvent);
    expect(deleteButton.textContent).toEqual(deleteTextSymbol);
});