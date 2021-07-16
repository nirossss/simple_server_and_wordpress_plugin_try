<?php
    /*
        Plugin Name: Smart Plugin
        Plugin URI: http://localhost/wordpress/smart
        Description: Smart Plugin for interview
        Author: Nirossss
        Author URI:
        Version: 1.0.0
    */

    if(!defined('ABSPATH')){
        die;
    }

    function smart_add_settings_page() {
        add_options_page( 'Smart Plugin', 'Smart', 'manage_options', 'smart-plugin', 'smart_render_plugin_settings_page' );
    }
    add_action( 'admin_menu', 'smart_add_settings_page' );

    function smart_render_plugin_settings_page() {
        ?>
        <h2>Smart Settings</h2>
        <form action="" method="post"> <!-- action options.php , didnt understend how to get input value -->
            <?php 
            settings_fields( 'smart_plugin_options' );
            do_settings_sections( 'smart_plugin' ); ?>
            <input name="submit" class="button button-primary" type="submit" value="<?php esc_attr_e( 'Save' ); ?>" />
        </form>
        <?php
    }

    function smart_register_settings() {
        register_setting( 'smart_plugin_options', 'smart_plugin_options');
        add_settings_section( 'smart_settings', 'Smart Winnings', 'smart_plugin_section_text', 'smart_plugin' );
    
        add_settings_field( 'smart_plugin_setting_winnings', 'Winnings', 'smart_plugin_setting_winnings', 'smart_plugin', 'smart_settings' );

    }
    add_action( 'admin_init', 'smart_register_settings' );

    function smart_plugin_section_text() {
        echo '<p>min 100 max 9000000</p>';
    }
    
    function smart_plugin_setting_winnings() {
        $options = get_option( 'smart_plugin_options' );
        echo "<input id='smart_plugin_setting_winnings' name='winnings' type='number' min='100' max='9000000'/>";
    }

    // action='' so suppose to get value of input by name.. dosent work
    if(isset($_POST['winnings'])) {
        $winnings = $_POST['winnings'];

        if(empty($winnings)) {
            echo "<p>*Empty winnings input</p>";

        } else {
            add_action( 'the_content', 'addWinnings' ); // suppose to add the content to the Plugin URI: http://localhost/wordpress/smart

            function addWinnings ( $content ) {
            return $content .= "<h1>$winnings</h1>"; //NOT WORKING
            }
        };
    };

