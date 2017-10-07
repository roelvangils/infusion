
/**
 * Apply the "Aria-LabbeledBy-On-Steroids" script
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @author   Roel Van Gils      <roel@catchup.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   target   Optional element to search in
 */
function albosApply(target) {
  
    var for_element,
        commands,
        elements,
        command,
        element,
        ids,
        i,
        j;
  
    if (!target) {
      target = document;
    }
  
    if (!window._albos_style) {
      window._albos_style = document.createElement('style');
      _albos_style.innerHTML = '.sr-only { position: absolute !important; clip: rect(1px 1px 1px 1px); }';
      document.body.appendChild(_albos_style);
    }
  
    // Get all elements with our custom 'data-labelledby' attribute
    elements = target.querySelectorAll('[data-labelledby]');
  
    // Now iterate over them
    for (i = 0; i < elements.length; i++) {
      _albosCompileAndApply('labelledby', elements[i]);
    }
  
    // Get all elements with our custom 'data-labelledby' attribute
    elements = target.querySelectorAll('[data-describedby]');
  
    // Now iterate over them
    for (i = 0; i < elements.length; i++) {
      _albosCompileAndApply('describedby', elements[i]);
    }
  
    // Get all elements with our custom 'data-labelledby' attribute
    elements = target.querySelectorAll('[data-controlledby]');
  
    // Now iterate over them
    for (i = 0; i < elements.length; i++) {
      _albosCompileAndApply('controlledby', elements[i]);
    }
  }
  
  /**
   * Compile and apply data-labelledby
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {String}        type
   * @param    {HTMLElement}   element
   */
  function _albosCompileAndApply(type, element) {
  
    var for_element,
        commands,
        command,
        element,
        ids,
        i;
  
    // Get the commands and split them
    commands = element.getAttribute('data-' + type).split(',');
  
    // Prepare the ids
    // (these will be used in the real aria-labelledby attribute)
    ids = '';
  
    // Iterate over the commands
    for (i = 0; i < commands.length; i++) {
  
      // Get the command and trim whitespace from both ends
      command = commands[i].trim();
  
      if (ids) {
        ids += ' ';
      }
  
      // Apply a single Albos command
      ids += _albosResolveCommand(type, element, command);
    }
  
    // And finally: set the aria-labelledby attribute
    element.setAttribute('aria-' + type, ids);
  }
  
  /**
   * Fix label elements
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {HTMLElement}   element
   * @param    {HTMLElement}   label
   */
  function _albosFixElementLabel(element, label) {
  
    var original_content,
        sr_content,
        nodes,
        node,
        i;
  
    // Make sure we didn't fix this before
    if (label.classList.contains('albos-fixed')) {
      return;
    }
  
    // Remember we already fixed this
    label.classList.add('albos-fixed');
  
    // Get the original content nodes
    nodes = label.childNodes;
  
    // Create a new span for them
    original_content = document.createElement('span');
  
    // Hide them from screenreaders
    original_content.setAttribute('aria-hidden', 'true');
    original_content.classList.add('albos-original-content');
  
    // And add the original nodes
    while (nodes.length) {
      node = nodes[0];
      original_content.appendChild(node);
    }
  
    // Add the original_content wrapper back to the label
    label.appendChild(original_content);
  
    // Create a new span, only for screenreaders
    sr_content = document.createElement('span');
  
    // Indicate it's only for screenreaders
    sr_content.classList.add('sr-only');
  
    // Use the originel text of the original content
    // as the initial new content
    sr_content.innerText = original_content.innerText;
  
    // And add the new content
    label.appendChild(sr_content);
  
    element.addEventListener('change', function onChange() {
      applyToLabel();
    });
  
    function applyToLabel() {
  
      var id_element,
          new_text,
          options,
          temp,
          text,
          ids,
          i,
          j;
  
      ids = element.getAttribute('aria-labelledby');
  
      if (!ids) {
        return;
      }
  
      ids = ids.split(' ')
      new_text = '';
  
      for (i = 0; i < ids.length; i++) {
        id_element = document.getElementById(ids[i]);
        text = '';
  
        if (!id_element) {
          continue;
        }
  
        if (id_element.nodeName == 'SELECT') {
          options = id_element.selectedOptions;
  
          for (j = 0; j < options.length; j++) {
            temp = _albosGetInnerText(options[j]);
  
            if (text) {
              text += ' ';
            }
  
            text += temp;
          }
        } else if (id_element.nodeName == 'INPUT') {
          if (id_element.type == 'checkbox') {
            text = String(id_element.checked);
          } else {
            text = id_element.value;
          }
        } else {
          text = _albosGetInnerText(id_element);
        }
  
        if (text) {
          if (new_text) {
            new_text += ' ';
          }
  
          new_text += text;
        }
      }
  
      sr_content.innerText = new_text;
    }
  
    applyToLabel();
  }
  
  /**
   * Get element text
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {HTMLElement}   element
   *
   * @return   {String}
   */
  function _albosGetInnerText(element) {
  
    var nodes,
        node,
        text,
        temp,
        i;
  
    temp = element.querySelector('.albos-original-content');
  
    if (temp) {
      return _albosGetInnerText(temp);
    }
  
    text = element.getAttribute('aria-label');
  
    if (text) {
      return text;
    }
  
    text = element.getAttribute('alt');
  
    if (text) {
      return text;
    }
  
    nodes = element.childNodes;
    text = '';
  
    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
  
      switch (node.nodeType) {
        case 1:
  
          if (node.getAttribute('aria-hidden') != 'true') {
            temp = _albosGetInnerText(node);
          }
  
          break;
  
        case 3:
          temp = node.textContent.trim();
          break;
      }
  
      if (temp) {
        if (text) {
          text += ' ';
        }
  
        text += temp;
      }
    }
  
    return text;
  }
  
  /**
   * Apply a single Albos command
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {HTMLElement}   element
   * @param    {String}        command
   */
  function _albosResolveCommand(type, element, command) {
  
    var target,
        new_id,
        bool;
  
    if (command[0] == "'") {
      return _albosResolveString(element, command);
    }
  
    // Resolve possible ternaries
    command = _albosParseTernary(type, element, command);
  
    // Get the wanted element
    target = document.querySelector(command.selector);
  
    // If a ternary is present, we'll need to add an on-change listener
    if (command.ternary) {
  
      // Make sure no on-change listener has been added yet
      if (!target.classList.contains('albos-ternaried-' + type)) {
  
        // Rememver the on-change listener has been added
        target.classList.add('albos-ternaried-' + type);
  
        // The actual on-change listener
        target.addEventListener('change', function onTargetChange(e) {
          // Quick and dirty: compile it again when the target changes!
          _albosCompileAndApply(type, element);
        });
      }
  
      if (target.nodeName == 'INPUT') {
        if (target.type == 'checkbox') {
          bool = target.checked;
        } else {
          bool = !!target.value;
        }
      } else {
        bool = !!target.value;
      }
  
      if (bool) {
        target = command.true;
      } else {
        target = command.false;
      }
  
      if (target) {
        target = document.getElementById(target);
      }
    }
  
    if (!target) {
      return '';
    }
  
    if (!target.id) {
      new_id = _albosGetAcronym(target.innerText);
  
      if (!new_id.length || new_id.length > 10) {
        new_id = 'ref';
      }
  
      new_id = _albosCreateId(new_id);
      target.id = new_id;
    }
  
    return target.id;
  }
  
  /**
   * Apply a single Albos text string
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {HTMLElement}   element
   * @param    {String}        text
   */
  function _albosResolveString(element, text) {
  
    var new_element,
        test_id,
        new_id,
        temp,
        i;
  
    // If there are still quotes,
    // remove them now
    if (text[0] == "'") {
      text = text.slice(1, -1);
    }
  
    new_id = 'albos_' + _albosGetAcronym(text);
    test_id = new_id;
    i = 0;
  
    while (true) {
      new_element = document.getElementById(test_id);
  
      if (new_element) {
        if (new_element.innerText == text) {
          break;
        }
  
        i++;
        test_id = new_id + i;
      } else {
        new_element = _albosCreateSpan(false, test_id);
        new_element.innerText = text;
  
        break;
      }
    }
  
    return test_id;
  }
  
  /**
   * Parse and replace "this" in commands
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {HTMLElement}   element
   * @param    {String}        command
   */
  function _albosParseThis(element, command) {
  
    var this_id,
        result,
        pieces,
        piece,
        i;
  
    if (command.indexOf('this') == -1) {
      return command;
    }
  
    if (!element.id) {
      element.id = _albosCreateId('this');
    }
  
    this_id = '#' + element.id;
  
    // Fix "this:" selectors
    command = command.replace(/this\:/g, 'this :');
  
    pieces = command.split(/ /g);
  
    for (i = 0; i < pieces.length; i++) {
      piece = pieces[i];
  
      if (piece == 'this') {
        pieces[i] = this_id;
      }
    }
  
    result = pieces.join(' ');
  
    return result;
  }
  
  /**
   * Parse ternaries
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {HTMLElement}   element
   * @param    {String}        command
   *
   * @return   {Object}
   */
  function _albosParseTernary(type, element, command) {
  
    var result,
        pieces;
  
    if (command.indexOf('?') > -1) {
      // Split the string by the questionmark
      pieces = command.split('?');
  
      // We already know the selector by know
      result = {
        selector : pieces[0].trim()
      };
    } else {
      result = {
        selector : command
      };
    }
  
    // Resolve "this" references
    result.selector = _albosParseThis(element, result.selector);
  
    // Resolve ":parent" references
    result.selector = _albosParseParent(element, result.selector);
  
    if (pieces) {
      // Split the actual ternary by the colon now
      pieces = pieces[1].trim().split(':');
  
      // Trim the others
      pieces[0] = pieces[0].trim();
      pieces[1] = pieces[1].trim();
  
      if (pieces[0]) {
        result.ternary = true;
        result.true = _albosResolveCommand(type, element, pieces[0]);
      }
  
      if (pieces[1]) {
        result.ternary = true;
        result.false = _albosResolveCommand(type, element, pieces[1]);
      }
    }
  
    return result;
  }
  
  /**
   * Parse :parent
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {HTMLElement}   element
   * @param    {String}        selector
   *
   * @return   {String}
   */
  function _albosParseParent(element, selector) {
  
    var new_id,
        result,
        pieces,
        piece,
        temp,
        i;
  
    if (selector.indexOf(':parent') == -1) {
      return selector;
    }
  
    if (!element.id) {
      element.id = _albosCreateId('this');
    }
  
    pieces = selector.split(':parent');
    result = '';
  
    for (i = 0; i < pieces.length; i++) {
      piece = pieces[i];
  
      if (result) {
        result += ' ';
      }
  
      result += piece;
  
      // See if this is the last piece
      if (i == pieces.length - 1) {
        break;
      }
  
      temp = document.querySelector(result);
  
      // If an element wasn't found, do nothing
      if (!temp) {
        result = '';
        break;
      }
  
      // Now switch to the parent
      temp = temp.parentElement;
  
      if (!temp.id) {
        new_id = _albosCreateId('parent');
        temp.id = new_id;
      }
  
      result = '#' + temp.id;
    }
  
    return result;
  
  }
  
  /**
   * Create a hidden span
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {String}       postfix
   * @param    {String}       force_id
   *
   * @return   {HTMLElement}
   */
  function _albosCreateSpan(postfix, force_id) {
  
    var element,
        new_id;
  
    element = document.createElement('span');
    element.hidden = true;
    element.style.display = 'none';
    element.setAttribute('tabindex', '-1'); /* Fix for IE 8/9/10 */
  
    document.body.appendChild(element);
  
    if (force_id) {
      element.id = force_id;
    } else if (postfix) {
      new_id = _albosCreateId(postfix);
      element.id = new_id;
    }
  
    return element;
  }
  
  /**
   * Create a new, unique id
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {String}       postfix
   * @param    {String}       force_id
   *
   * @return   {String}       The id to use
   */
  function _albosCreateId(postfix, force_id) {
  
    var test_element,
        test_id,
        new_id,
        i;
  
    if (force_id) {
      new_id = force_id;
    } else {
      new_id = 'albos_' + postfix;
    }
  
    test_id = new_id;
    i = 0;
  
    // Do this (until we break)
    while (true) {
      // See if an element with this id already exists
      test_element = document.getElementById(test_id);
  
      // If it doesn't:
      // Good! The id can be used
      if (!test_element) {
        break;
      }
  
      // It did exist.
      // Increment the counter and add to the id name
      i++;
      test_id = new_id + i;
    }
  
    return test_id;
  }
  
  /**
   * Simple acronym generator
   *
   * @author   Jelle De Loecker   <jelle@develry.be>
   * @author   Roel Van Gils      <roel@catchup.be>
   * @since    0.1.0
   * @version  0.1.0
   *
   * @param    {String}   sentence
   *
   * @return   {String}   The acronym
   */
  function _albosGetAcronym(sentence) {
  
    var next_word,
        acronym,
        index,
        words;
  
    words = sentence.split(/\s/g);
    acronym = '';
    index = 0
  
    for (index = 0; index < words.length; index++) {
      next_word = words[index];
      acronym += next_word.charAt(0);
    }
  
    return acronym;
  }
