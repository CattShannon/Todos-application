const utils = require('../javascript/utils');

let elementTest;
let textContentTest;

test("get an dom element", () => {
    //Arrange
    elementTest = document.createElement("label");
    elementTest.id = "test";
    document.body.insertAdjacentElement("afterbegin", elementTest);
    
    //Act
    let element = utils.getElement("#test"); 
    //Assert
    expect(element).toEqual(elementTest);
}); 



test("get all dom elements which has the same selector", () => {
    //Arrange
    let element1 = document.createElement("div");
    element1.classList.add("test");

    let element2 = document.createElement("label");
    element2.classList.add("test");

    let element3 = document.createElement("footer");
    element3.classList.add("test");

    document.body.insertAdjacentElement("beforeend", element1);
    document.body.insertAdjacentElement("beforeend", element2);
    document.body.insertAdjacentElement("beforeend", element3);

    //Act
    let listOfNodesWithSameClassName = utils.getAllElementsBy(".test");

    //Assert
    expect(listOfNodesWithSameClassName.length).toBe(3);
    expect(listOfNodesWithSameClassName[0].nodeName).toBe("DIV");
    expect(listOfNodesWithSameClassName[1].nodeName).toBe("LABEL");
    expect(listOfNodesWithSameClassName[2].nodeName).toBe("FOOTER");

});

test("get input value", () => {
    //Arrange
    elementTest = document.createElement("input");
    elementTest.type = "text";
    elementTest.id = "test";
    elementTest.value = "Test me"
    document.body.insertAdjacentElement("beforebegin", elementTest);

    //Act
    const textValue = utils.getInputValue("#test");

    //Assert
    expect(textValue).toBe("Test me");
});

describe("test check value of a checkbox", () => {
    beforeEach(() => {
        elementTest = document.createElement("input");
        elementTest.type = "checkbox";
        elementTest.id = "testCheck";
        document.body.insertAdjacentElement("beforeend", elementTest);
    });

    afterEach(() => {
        elementTest.remove();
        elementTest = "";
    })
     
    test("get checked value -> true", () => {
        //Arrange
        elementTest.checked = true;
    
        //Act
        const checkValue = utils.getCheckedValue("#testCheck");
    
        //Assert
        expect(checkValue).toBeTruthy();
    });

    test("get checked value -> false", () => {
        //Arrange
        elementTest.checked = false;
    
        //Act
        const checkValue = utils.getCheckedValue("#testCheck");
    
        //Assert
        expect(checkValue).toBeFalsy();
    });

    test("set checked value", () => {
        //Arrange
        elementTest.checked = false;

        //Act
        utils.setCheckedValue("#testCheck", true);

        //Assert
        expect(elementTest.checked).not.toBeFalsy();
        expect(elementTest.checked).not.toBeNull();
        expect(elementTest.checked).not.toBeUndefined();
        expect(elementTest.checked).toBeTruthy();
        
    })
})

describe("check class in one element", () => {
    beforeEach(() => {
        elementTest = document.createElement("div");
    })
    afterAll(() => {
        elementTest.remove();
        elementTest = "";
    });
    test("the element contains the class", () => {
        //Arrange
        elementTest.classList.add("container_todo");
        //Act
        let response = utils.checkIfContainsClass(elementTest, "container_todo");
        //Assert
        expect(response).toBeTruthy();
    });

    test("the element doens't contains the class", () => {
        //Arrange
        elementTest.classList.add("container_todo");
        //Act
        let response = utils.checkIfContainsClass(elementTest, "todo_todo");
        //Assert
        expect(response).toBeFalsy();
    })
});

test("replacing class name in one element", () => {
    //Arrange
    let elementTest = document.createElement("p");
    elementTest.classList.add("change");
    
    const initialSizeClassList = elementTest.classList.length;
    //Act
    utils.replaceClassName(elementTest, "change", "newClassName");

    //Assert
    expect(elementTest.classList[0]).toBe("newClassName");
    expect(elementTest.classList.length).toBe(initialSizeClassList);
});

describe("setting element properties", () => {

    describe("set element display", () => {
        beforeAll(() => {
            elementTest = document.createElement("p");
            elementTest.style.display = "block";
        })

        afterAll(() => {
            elementTest.remove();
            elementTest = "";
        });

        test("set none display", () => {
            //Arrange

            //Act
            utils.setElementDisplay(elementTest, "none");
            //Assert
            expect(elementTest.style.display).toBe("none");
            expect(elementTest).not.toBeUndefined();
            expect(elementTest).not.toBeNull();
        });
        
        test("set block display", () => {
            //Arrange

            //Act
            utils.setElementDisplay(elementTest, "block");
            //Assert
            expect(elementTest.style.display).toBe("block");
            expect(elementTest).not.toBeUndefined();
            expect(elementTest).not.toBeNull();
        });
    });

    describe("setting element visibility", () => {
        beforeEach(() => {
            elementTest = document.createElement("p");
            elementTest.id = "testVisibility";
            let textContent = document.createTextNode("Helo test");
            elementTest.appendChild(textContent);
            document.body.insertAdjacentElement("beforeend", elementTest);
        })

        afterEach(() => {
            elementTest.remove();
            elementTest = "";
        })

        test("setting element visibility to hidden", () => {
            //Arrange
            elementTest.style.visibility = "visible";

            //Act
            utils.setElementVisibility("#testVisibility", "hidden");

            //Assert
            expect(elementTest.style.visibility).toBe("hidden");
        });

        test("setting element visibility to visible", () => {
            //Arrange
            elementTest.style.visibility = "hidden";

            //Act
            utils.setElementVisibility("#testVisibility", "visible");

            //Assert
            expect(elementTest.style.visibility).toBe("visible");
        });
    });

    describe("element text content manipulation", () => {
        beforeEach(() => {
            elementTest = document.createElement("p");
            textContentTest = document.createTextNode("Hello");
            elementTest.appendChild(textContentTest);
        });

        afterAll(() => {
            elementTest.remove();
            elementTest = "";
            textContentTest.remove();
            textContentTest =  "";
        });

        test("set element text content", () => {
            //Arrange
    
            //Act
            const newtextContent = "World";
            utils.setElementTextContent(elementTest, newtextContent);
    
            //Assert
            expect(elementTest.textContent).toBe(newtextContent);
        });

        test("set element text content -> null", () => {
            //Arrange
    
            //Act
            const newtextContent = "";
            utils.setElementTextContent(elementTest, null);
    
            //Assert
            expect(elementTest.textContent).toBe(newtextContent);
        });

        test("set element text content -> undefined", () => {
            //Arrange
    
            //Act
            const newtextContent = "";
            utils.setElementTextContent(elementTest, undefined);
    
            //Assert
            expect(elementTest.textContent).toBe(newtextContent);
        });

    });

    describe("set input value to an element", () => {
        beforeAll(() => {
            elementTest = document.createElement("input")
            elementTest.type = "text";
            elementTest.value = "";
        });

        afterAll(() => {
            elementTest.remove();
            elementTest = "";
        });

        test("set input value", () => {
            //Arrange

            //Act
            const newInputValue = "hello world";
            utils.setInputValue(elementTest, newInputValue);
            //Assert
            expect(elementTest.value).not.toBe("");
            expect(elementTest.value).toBe(newInputValue);
        });
    });
    
});


test("insert html element in a position respect at an specific node",
() => {
    //Arrange
    elementTest = document.createElement("div");
    let elementToInsert = document.createElement("p");
    let initialNumberOfChildren = elementTest.childElementCount;
    
    //Act
    utils.insertHTMLElement(elementTest, "afterbegin", elementToInsert);
    
    //Assert
    expect(elementTest.hasChildNodes()).toBeTruthy();
    expect(elementTest.childElementCount).toBeGreaterThan(initialNumberOfChildren);
    expect(elementTest.firstChild.nodeName).toBe("P");
});

describe("family nodes", () => {
    beforeAll(() => {
        elementTest = document.createElement("div");
        let secondElementTest = document.createElement("label");
        elementTest.appendChild(secondElementTest);
    })
    afterAll(() => {
        elementTest.remove();
        elementTest = "";
    })

    test("get parent node",() => {
        //Arrange
        const childNode = elementTest.firstChild;
        //Act
        let parentNode = utils.getParentNode(childNode);
        //Assert
        expect(parentNode).toEqual(elementTest);
        expect(parentNode.nodeName).toBe(elementTest.nodeName);
    });

    test("get sibling node",() => {
        //Arrange
        const firstChildNode = elementTest.firstChild;
        const secondChildNode = document.createElement("label");
        elementTest.appendChild(secondChildNode);
        //Act
        let siblingNode = utils.getSiblingNode(firstChildNode);
        //Assert
        expect(siblingNode).toEqual(secondChildNode);
        expect(secondChildNode.nodeName).toBe(secondChildNode.nodeName);
        expect(siblingNode.nextElementSibling).toBeNull(); 
    });
});





