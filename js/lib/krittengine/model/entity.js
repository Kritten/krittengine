/**
 * @private
 * @instance
 * @type {String}
 * @memberOf Entity
 */
const m_entity_name = new WeakMap();
/**
 * Represents a entity
 * @class
 */
class Entity
{
	constructor(name)
	{
		if(name == undefined)
		{
			console.error('You have to specify a name for the entity')
		} else {
			m_entity_name.set(this, name);
		}
	}

	set_init_vars(func)
	{
		this.init_vars = func
		this.init_vars()
	}

	init_vars()
	{

	}

	update_all()
	{
		this.update()
	}

	update()
	{
		console.log("update Entity")
	}

	get name() { return m_entity_name.get(this) }
}