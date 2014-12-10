
describe('bugs homepage', function() {
  it('should click', function() {
  	browser.get('http://localhost:3000/#!/');
	element(by.id('signin')).click();
	element(by.id('username')).sendKeys('test');
	element(by.id('password')).sendKeys('testtest');
	element(by.id('signin')).click();

	browser.driver.sleep(2000);

	browser.get('http://localhost:3000/#!/collections');
	browser.driver.sleep(2000);
	browser.get('http://localhost:3000/#!/collections/create');
	element(by.id('name')).sendKeys('Bug Pokemon');
	element(by.id('description')).sendKeys('These are not poison type');
	element(by.id('Ladybug')).click();
	element(by.id('goButton')).click();

	browser.driver.sleep(2000);
	browser.get('http://localhost:3000/#!/insects');
	browser.driver.sleep(2000);
	browser.get('http://localhost:3000/#!/insects/548896c5d79f2e4d74818def');
	element(by.id('content')).sendKeys('cool');
	browser.driver.sleep(2000);
	element(by.id('gogo')).click();
	element(by.id('pdfClik')).click();

	browser.driver.sleep(4000);

	
	//element(by.id('selectedInsects')).click();

  });
});
